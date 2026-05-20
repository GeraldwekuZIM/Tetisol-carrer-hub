"use client"

import Link from "next/link"
import { useState } from "react"
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
import {
  CalendarIcon,
  FilePenLineIcon,
  InboxIcon,
  MoveRightIcon,
} from "lucide-react"
import { toast } from "sonner"

import { useCareerHub } from "@/components/providers/career-hub-provider"
import { EmptyState, PageIntro, StatCard } from "@/components/shared/app-primitives"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  applicationStatuses,
  type ApplicationRecord,
  type ApplicationStatus,
} from "@/types"

function DroppableColumn({
  status,
  children,
}: {
  status: ApplicationStatus
  children: React.ReactNode
}) {
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-72 rounded-[1.5rem] border p-4 transition ${
        isOver ? "border-primary bg-primary/8" : "border-border bg-white/70"
      }`}
    >
      {children}
    </div>
  )
}

function DraggableApplicationCard({
  application,
  title,
  company,
  onEdit,
}: {
  application: ApplicationRecord
  title: string
  company: string
  onEdit: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: application.id,
    })

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
      }}
      className={`rounded-[1.25rem] border border-border bg-white p-4 shadow-sm transition ${
        isDragging ? "opacity-60 shadow-lg" : ""
      }`}
    >
      <div className="cursor-grab space-y-3" {...attributes} {...listeners}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-heading text-lg font-semibold text-slate-950">
              {title}
            </p>
            <p className="text-sm text-slate-500">{company}</p>
          </div>
          <Badge className="rounded-full border border-border bg-secondary text-slate-600">
            {application.status}
          </Badge>
        </div>
        <div className="space-y-2 text-sm leading-6 text-slate-600">
          <p>{application.notes}</p>
          <p className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs">
            <CalendarIcon className="size-3.5" />
            Deadline {application.deadline || "Not set"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={onEdit} size="sm" type="button" variant="outline">
          <FilePenLineIcon className="size-4" />
          Edit
        </Button>
      </div>
    </div>
  )
}

export function KanbanBoard() {
  const {
    activeWorkspace,
    savedInternships,
    state,
    addInternshipToTracker,
    moveApplication,
    updateApplicationDetails,
  } = useCareerHub()
  const sensors = useSensors(useSensor(PointerSensor))
  const [editingApplicationId, setEditingApplicationId] = useState<string | null>(
    null
  )
  const [notes, setNotes] = useState("")
  const [deadline, setDeadline] = useState("")

  const applications = activeWorkspace?.applications ?? []
  const editingApplication = applications.find(
    (application) => application.id === editingApplicationId
  )

  function handleDragEnd(event: DragEndEvent) {
    if (!event.over) {
      return
    }

    const nextStatus = event.over.id as ApplicationStatus
    if (!applicationStatuses.includes(nextStatus)) {
      return
    }

    moveApplication(event.active.id as string, nextStatus)
    toast.success(`Moved application to ${nextStatus}.`)
  }

  const untrackedSavedInternships = savedInternships.filter(
    (internship) =>
      !applications.some((application) => application.internshipId === internship.id)
  )
  const upcomingTrackedDeadlines = applications.filter((application) => application.deadline)
  const offerCount = applications.filter((application) => application.status === "Offer").length

  if (!activeWorkspace) {
    return null
  }

  return (
    <div className="space-y-8">
      <PageIntro
        eyebrow="Application tracker"
        title="Manage every role with less mental clutter"
        description="Drag cards across statuses, keep notes attached, and stay ahead of deadlines without juggling multiple tools."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          helper="Roles currently moving through your pipeline"
          icon={InboxIcon}
          label="Tracked roles"
          value={`${applications.length}`}
        />
        <StatCard
          helper="Saved opportunities still waiting to be activated"
          icon={MoveRightIcon}
          label="Ready to track"
          value={`${untrackedSavedInternships.length}`}
        />
        <StatCard
          helper="Applications that already have deadlines attached"
          icon={CalendarIcon}
          label="Deadlines set"
          value={`${upcomingTrackedDeadlines.length}`}
        />
        <StatCard
          helper="Offer-stage opportunities currently in the system"
          icon={FilePenLineIcon}
          label="Offers"
          value={`${offerCount}`}
        />
      </div>

      {untrackedSavedInternships.length ? (
        <Card className="glass-card rounded-[1.75rem] border-white/80">
          <CardHeader>
            <CardTitle className="font-heading text-2xl text-slate-950">
              Saved roles ready for tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            {untrackedSavedInternships.map((internship) => (
              <Button
                key={internship.id}
                className="rounded-full"
                onClick={() => {
                  addInternshipToTracker(internship.id)
                  toast.success("Added to tracker.")
                }}
                type="button"
                variant="outline"
              >
                {internship.title}
                <MoveRightIcon className="size-4" />
              </Button>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {applications.length ? (
        <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
          <div className="grid gap-5 xl:grid-cols-5">
            {applicationStatuses.map((status) => {
              const statusApplications = applications.filter(
                (application) => application.status === status
              )

              return (
                <DroppableColumn key={status} status={status}>
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="font-heading text-xl font-semibold text-slate-950">
                      {status}
                    </h2>
                    <Badge className="rounded-full bg-primary/10 text-primary">
                      {statusApplications.length}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {statusApplications.length ? (
                      statusApplications.map((application) => {
                        const internship = state.internships.find(
                          (item) => item.id === application.internshipId
                        )

                        return (
                          <DraggableApplicationCard
                            key={application.id}
                            application={application}
                            company={internship?.company ?? "Unknown company"}
                            onEdit={() => {
                              setEditingApplicationId(application.id)
                              setNotes(application.notes)
                              setDeadline(application.deadline)
                            }}
                            title={internship?.title ?? "Internship"}
                          />
                        )
                      })
                    ) : (
                      <div className="rounded-[1.25rem] border border-dashed border-border bg-white/70 p-4 text-sm leading-6 text-slate-500">
                        Drop an application here when it reaches this stage.
                      </div>
                    )}
                  </div>
                </DroppableColumn>
              )
            })}
          </div>
        </DndContext>
      ) : (
        <EmptyState
          action={
            <Link
              className={buttonVariants({
                variant: "default",
                className: "rounded-full px-5",
              })}
              href="/internships"
            >
              Explore internships
            </Link>
          }
          className="rounded-[1.75rem]"
          description="Add a few opportunities from the internship finder and they will appear here as moveable cards."
          icon={InboxIcon}
          title="Your tracker is empty"
        />
      )}

      <Dialog
        onOpenChange={(open) => {
          if (!open) {
            setEditingApplicationId(null)
          }
        }}
        open={Boolean(editingApplication)}
      >
        <DialogContent className="max-w-lg rounded-[1.75rem]">
          <DialogHeader>
            <DialogTitle>Edit application details</DialogTitle>
            <DialogDescription>
              Keep notes and deadlines attached to the role so the next step is always obvious.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="application-notes">Notes</Label>
              <Textarea
                className="min-h-32"
                id="application-notes"
                onChange={(event) => setNotes(event.target.value)}
                value={notes}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="application-deadline">Deadline</Label>
              <Input
                id="application-deadline"
                onChange={(event) => setDeadline(event.target.value)}
                type="date"
                value={deadline}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (!editingApplicationId) {
                  return
                }

                updateApplicationDetails(editingApplicationId, {
                  notes,
                  deadline,
                })
                toast.success("Application details updated.")
                setEditingApplicationId(null)
              }}
              type="button"
            >
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
