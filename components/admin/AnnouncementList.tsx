// In app/admin/announcements/_components/AnnouncementList.tsx
"use client";

import { useTransition, useState } from "react";
import { type Announcement } from "@prisma/client";
// import {
//   createAnnouncement,
//   deleteAnnouncement,
//   setActiveAnnouncement,
//   updateAnnouncement,
// } from "@/actions/announcements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, Edit, Save, X, CheckCircle2, Circle } from "lucide-react";
import {
  createAnnouncement,
  deleteAnnouncement,
  toggleAnnouncementActive,
  updateAnnouncement,
} from "@/lib/actions/announcement";

interface AnnouncementListProps {
  announcements: Announcement[];
}

export function AnnouncementList({ announcements }: AnnouncementListProps) {
  const [isPending, startTransition] = useTransition();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (ann: Announcement) => {
    setEditingId(ann.id);
    setEditText(ann.text);
  };

  const handleSave = (id: string) => {
    startTransition(async () => {
      await updateAnnouncement(id, editText);
      toast.success("Announcement updated!");
      setEditingId(null);
    });
  };

  return (
    <div className="space-y-6">
      {/* --- Add New Announcement Form --- */}
      <form
        action={async (formData) => {
          const result = await createAnnouncement(formData);
          if (result?.error) toast.error(result.error);
          else toast.success("New announcement added!");
          (
            document.getElementById("new-announcement-form") as HTMLFormElement
          )?.reset();
        }}
        id="new-announcement-form"
        className="flex gap-2 items-center"
      >
        <Input name="text" placeholder="New announcement text..." required />
        <Button type="submit">Add New</Button>
      </form>

      {/* --- List of Existing Announcements --- */}
      <div className="rounded-md border">
        <ul className="divide-y">
          {announcements.map((ann) => (
            <li key={ann.id} className="p-4 flex justify-between items-center">
              {editingId === ann.id ? (
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="mr-2"
                />
              ) : (
                <p className="flex-1">{ann.text}</p>
              )}

              <div className="flex items-center gap-2">
                {editingId === ann.id ? (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSave(ann.id)}
                      disabled={isPending}
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(ann)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        startTransition(() => deleteAnnouncement(ann.id))
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant={ann.isActive ? "secondary" : "ghost"}
                      onClick={() =>
                        startTransition(() =>
                          toggleAnnouncementActive(ann.id, ann.isActive)
                        )
                      } // Use the new toggle action
                      title={ann.isActive ? "Deactivate" : "Activate"}
                    >
                      {ann.isActive ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      ) : (
                        <Circle className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
