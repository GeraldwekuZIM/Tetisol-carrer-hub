import { mkdir, rm, writeFile } from "node:fs/promises"
import { join, resolve } from "node:path"
import { spawn } from "node:child_process"

const ROOT = resolve(import.meta.dirname, "..")
const OUTPUT_DIR = join(ROOT, "docs", "heygen-assets")
const USER_DATA_DIR = join(ROOT, ".tmp", "chrome-heygen")
const BASE_URL = "http://localhost:3000"
const STORAGE_KEY = "tetisol-learning-platform-state-v3"
const PORT = 9223

const chromeCandidates = [
  "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
  "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
]

const shots = [
  { name: "01-landing-page.png", route: "/", userId: null },
  { name: "02-course-catalog.png", route: "/courses", userId: null },
  {
    name: "03-course-detail.png",
    route: "/courses/introduction-to-artificial-intelligence",
    userId: null,
  },
  { name: "04-student-dashboard.png", route: "/dashboard", userId: "user-demo" },
  { name: "05-my-learning.png", route: "/learning", userId: "user-demo" },
  { name: "06-certificates.png", route: "/certificates", userId: "user-demo" },
  { name: "07-cv-builder.png", route: "/cv-builder", userId: "user-demo" },
  { name: "08-internships.png", route: "/internships", userId: "user-demo" },
  { name: "09-applications.png", route: "/applications", userId: "user-demo" },
  { name: "10-admin-dashboard.png", route: "/admin", userId: "user-admin" },
  { name: "11-admin-analytics.png", route: "/admin/analytics", userId: "user-admin" },
]

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms))
}

async function exists(path) {
  try {
    await import("node:fs/promises").then(({ access }) => access(path))
    return true
  } catch {
    return false
  }
}

async function findChrome() {
  for (const candidate of chromeCandidates) {
    if (await exists(candidate)) {
      return candidate
    }
  }
  throw new Error("Chrome or Edge was not found in a standard install path.")
}

class CdpSession {
  constructor(ws) {
    this.ws = ws
    this.nextId = 1
    this.pending = new Map()
    this.events = new Map()

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.id && this.pending.has(message.id)) {
        const { resolve: resolvePending, reject } = this.pending.get(message.id)
        this.pending.delete(message.id)
        if (message.error) {
          reject(new Error(message.error.message))
          return
        }
        resolvePending(message.result)
        return
      }

      const listeners = this.events.get(message.method) ?? []
      for (const listener of listeners) {
        listener(message.params)
      }
    }
  }

  send(method, params = {}) {
    const id = this.nextId++
    this.ws.send(JSON.stringify({ id, method, params }))
    return new Promise((resolvePromise, reject) => {
      this.pending.set(id, { resolve: resolvePromise, reject })
    })
  }

  once(method, timeoutMs = 10000) {
    return new Promise((resolvePromise) => {
      const timer = setTimeout(() => {
        this.events.set(
          method,
          (this.events.get(method) ?? []).filter((listener) => listener !== done)
        )
        resolvePromise(null)
      }, timeoutMs)

      const done = (params) => {
        clearTimeout(timer)
        this.events.set(
          method,
          (this.events.get(method) ?? []).filter((listener) => listener !== done)
        )
        resolvePromise(params)
      }

      this.events.set(method, [...(this.events.get(method) ?? []), done])
    })
  }
}

async function waitForDebugger() {
  const endpoint = `http://127.0.0.1:${PORT}/json/list`
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(endpoint)
      const pages = await response.json()
      const page = pages.find((entry) => entry.type === "page")
      if (page?.webSocketDebuggerUrl) {
        return page.webSocketDebuggerUrl
      }
    } catch {
      // Browser is still starting.
    }
    await delay(250)
  }
  throw new Error("Timed out waiting for Chrome DevTools Protocol.")
}

async function navigate(session, route) {
  const load = session.once("Page.loadEventFired", 15000)
  await session.send("Page.navigate", { url: `${BASE_URL}${route}` })
  await load
  await delay(2500)
}

async function setActiveUser(session, userId) {
  if (!userId) {
    await session.send("Runtime.evaluate", {
      expression: `(() => {
        const raw = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
        if (!raw) return;
        const state = JSON.parse(raw);
        state.activeUserId = null;
        localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, JSON.stringify(state));
      })()`,
    })
    return
  }

  await session.send("Runtime.evaluate", {
    expression: `(() => {
      const raw = localStorage.getItem(${JSON.stringify(STORAGE_KEY)});
      if (!raw) throw new Error("Career Hub demo state was not initialized.");
      const state = JSON.parse(raw);
      state.activeUserId = ${JSON.stringify(userId)};
      localStorage.setItem(${JSON.stringify(STORAGE_KEY)}, JSON.stringify(state));
    })()`,
    awaitPromise: true,
  })
}

async function capture(session, filePath) {
  const result = await session.send("Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  })
  await writeFile(filePath, Buffer.from(result.data, "base64"))
}

async function main() {
  const chrome = await findChrome()
  await mkdir(OUTPUT_DIR, { recursive: true })
  await rm(USER_DATA_DIR, { recursive: true, force: true })

  const child = spawn(chrome, [
    "--headless=new",
    `--remote-debugging-port=${PORT}`,
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    "--hide-scrollbars",
    "--window-size=1440,1000",
    `--user-data-dir=${USER_DATA_DIR}`,
    "about:blank",
  ])

  try {
    const webSocketDebuggerUrl = await waitForDebugger()
    const ws = new WebSocket(webSocketDebuggerUrl)
    await new Promise((resolveOpen) => {
      ws.onopen = resolveOpen
    })

    const session = new CdpSession(ws)
    await session.send("Page.enable")
    await session.send("Runtime.enable")
    await session.send("Emulation.setDeviceMetricsOverride", {
      width: 1440,
      height: 1000,
      deviceScaleFactor: 1,
      mobile: false,
    })

    await navigate(session, "/")

    for (const shot of shots) {
      await setActiveUser(session, shot.userId)
      await navigate(session, shot.route)
      await capture(session, join(OUTPUT_DIR, shot.name))
      console.log(`Captured ${shot.name}`)
    }

    ws.close()
  } finally {
    child.kill()
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
