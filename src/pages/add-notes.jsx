import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";

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

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
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

  const onSubmit = (data) => {
    fnCreateNote({
      ...data,
      recruiter_id: user.id,
    });
  };

  if (!isLoaded || loadingTopics) {
    return (

        <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />

    );
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

        <form onSubmit={handleSubmit(onSubmit)} className=" mx-auto space-y-6">
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
                  <Select 
                    value={field.value} 
                    onValueChange={field.onChange}
                  >
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
              <BarLoader width={"100%"} color="#36d7b7" />
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="destructive"
            size="lg"
            className="w-full"
            disabled={isSubmitting || loadingCreateNote}
          >
            {isSubmitting || loadingCreateNote ? "Posting..." : "Post Note"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default AddNotes;