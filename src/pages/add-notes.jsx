import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { motion } from "framer-motion";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { NotificationToggle } from "@/components/NotificationToggle";
import { createNotification } from '@/lib/notification-service';

// UI Components
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import Header from "@/components/header";
import AddTopicDrawer from "@/components/add-topic-drawer";

// API and Hooks
import { getTopics } from "@/api/api-topics";
import { addNewNote } from "@/api/api-Notes";
import useFetch from "@/hooks/use-fetch";


const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  topic_id: z.string().min(1, { message: "Select or add a new topic" }),
  content: z.string().min(1, { message: "Content is required" }),
});

const AddNotes = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [formData, setFormData] = useState(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [broadcastNotification, setBroadcastNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      topic_id: "",
      content: "",
    },
    resolver: zodResolver(schema),
  });

  // Fetch topics
  const {
    fn: fnTopics,
    data: topics,
    loading: loadingTopics,
    error: errorTopics,
  } = useFetch(getTopics);

  // Create note
  const {
    fn: fnCreateNote,
    loading: loadingCreateNote,
    error: errorCreateNote,
    data: dataCreateNote,
  } = useFetch(addNewNote);

  useEffect(() => {
    if (isLoaded) fnTopics();
  }, [isLoaded]);

  useEffect(() => {
    if (dataCreateNote && !loadingCreateNote) {
      reset();
      navigate("/notes");
    }
  }, [dataCreateNote, loadingCreateNote]);

  const onSubmit = async (data) => {
    try {
      // Create the note first
      const noteResult = await fnCreateNote({
        ...data,
        recruiter_id: user.id,
      });

      if (!noteResult?.id) {
        throw new Error('Failed to create note');
      }

      // If notification is enabled, send it
      if (broadcastNotification) {
        const notificationResult = await createNotification({
          title: 'New Note Available',
          message: notificationMessage || `New note added: ${data.title}`,
          type: 'note_new',
          metadata: {
            note_id: noteResult.id,
            topic_id: data.topic_id
          },
          created_by: user?.id
        });

        if (!notificationResult.success) {
          console.error('Failed to send notification:', notificationResult.error);
          toast.error('Note created but notification failed to send');
          return;
        }

        toast.success('Note created and notification sent successfully');
      } else {
        toast.success('Note created successfully');
      }

      reset();
      navigate("/notes");
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.message || 'Failed to create note');
    }
  };

  const handleConfirmSubmit = (data) => {
    setFormData(data);
    setShowConfirmDialog(true);
  };

  const handleConfirmed = () => {
    onSubmit(formData);
    setShowConfirmDialog(false);
  };

  const NotePreview = ({ data }) => (
    <div className="bg-black/20 backdrop-blur-sm p-6 rounded-lg border border-primary/10">
      <h3 className="text-xl font-bold mb-2">{data.title}</h3>
      <p className="text-muted-foreground mb-4">{data.description}</p>
      <div className="prose prose-invert max-w-none">
        <MDEditor.Markdown source={data.content} />
      </div>
    </div>
  );

  if (!isLoaded || loadingTopics) {
    return <BarLoader className="bg-gradient-to-r from-blue-400 to-cyan-400" width="100%"/>;
  }

  if (errorTopics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading topics: {errorTopics.message}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
          Post a Note
        </h1>

        <form onSubmit={handleSubmit(handleConfirmSubmit)} className="mx-auto space-y-6">
          {/* Title Input */}
          <div>
            <Input
              placeholder="Note title"
              {...register("title")}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Description Textarea */}
          <div>
            <Textarea
              placeholder="Note Description"
              {...register("description")}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          {/* Topic Selection */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Controller
                name="topic_id"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className={errors.topic_id ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select a topic">
                        {field.value
                          ? topics?.find((topic) => topic.id === field.value)?.name
                          : "Topics"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {topics?.map(({ name, id, topic_logo_url }) => (
                          <SelectItem key={id} value={id.toString()}>
                            <div className="flex items-center gap-2">
                              {topic_logo_url && (
                                <img
                                  src={topic_logo_url}
                                  alt={name}
                                  className="w-6 h-6 object-contain"
                                />
                              )}
                              {name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.topic_id && (
                <p className="text-red-500 text-sm mt-1">{errors.topic_id.message}</p>
              )}
            </div>
            <AddTopicDrawer fetchTopics={fnTopics} />
          </div>

          {/* Content Editor */}
          <div>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  className={errors.content ? "border-red-500" : ""}
                />
              )}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Error Messages */}
          {errorCreateNote && (
            <div className="bg-red-50 p-4 rounded-md">
              <p className="text-red-500">{errorCreateNote.message}</p>
            </div>
          )}

          {/* Loading State */}
          {loadingCreateNote && (
            <div className="py-2">
              <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%"  />
            </div>
          )}

          {/* Notification Toggle */}
          <NotificationToggle
            enabled={broadcastNotification}
            onEnabledChange={setBroadcastNotification}
            notificationMessage={notificationMessage}
            onMessageChange={setNotificationMessage}
            defaultMessage={`New note added: ${watch("title")}`}
            className="border-t border-primary/10 pt-6"
          />

          {/* Submit and Preview Buttons */}
          <div className="flex gap-4">
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1"
            >
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="w-full border-primary/20 hover:border-primary/40"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? "Edit" : "Preview"}
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="flex-1"
            >
              <Button
                type="submit"
                size="lg"
                className="w-full relative group bg-gradient-to-r from-primary to-blue-600 hover:opacity-90 transition-all duration-300"
                disabled={isSubmitting || loadingCreateNote}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting || loadingCreateNote ? (
                    <>
                      <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%"  />
                      Posting...
                    </>
                  ) : (
                    "Post Note"
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
              </Button>
            </motion.div>
          </div>
        </form>

        {isPreviewMode && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <h2 className="text-2xl font-bold mb-4">Preview</h2>
            <NotePreview data={watch()} />
          </motion.div>
        )}

        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent className="bg-background border border-primary/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-xl font-bold">
                Confirm Submission
              </AlertDialogTitle>
              <AlertDialogDescription className="text-muted-foreground">
                Are you sure you want to post this note? Please verify that all information is correct.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="border-primary/20 hover:border-primary/40"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmed}
                className="bg-primary hover:bg-primary/90"
              >
                Confirm & Post
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </main>
    </div>
  );
};

export default AddNotes;
