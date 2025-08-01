import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { getTopics } from "@/api/api-topics";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@/contexts/AuthContext";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { updateBlog,getSavedBlog, getSingleBlog } from "@/api/api-blogs";
import { useNavigate, useParams } from "react-router-dom";
import AddTopicDrawer from "@/components/add-topic-drawer";
import Header from "@/components/header";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  author_name: z.string().min(1,{message: "Author name is required"}),
  content: z.string().min(1, { message: "Content is required" }),
});

const EditBlog = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const { blogId } = useParams();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      author_name: "",
      topic_id: "",
      content: "",
      created_at: "",
    },
  });

  const {
    fn: fnTopics,
    data: topics,
    loading: loadingTopics,
  } = useFetch(getTopics);

  const {
    fn: fnGetBlog,
    data: blog,
    loading: loadingBlog,
  } = useFetch(getSingleBlog, { blog_id: blogId });

  const {
    fn: fnUpdateBlog,
    loading: loadingUpdateBlog,
    error: errorUpdateBlog,
  } = useFetch(updateBlog);

  // Fetch topics and note data on component mount
  useEffect(() => {
    if (isLoaded) {
      fnTopics();
      fnGetBlog();
    }
  }, [isLoaded]);

  // Populate form with existing note data
  useEffect(() => {
    if (blog) {
      reset({
        title: blog.title || "",
        author_name: blog.author_name || "",
        content: blog.content || "",
      });
    }
  }, [blog, reset]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        id: blogId,
        title: data.title,
        author_name: data.author_name,
        content: data.content || "", // Ensure content is always a string
        recruiter_id: user.id,
      };

      await fnUpdateBlog(payload);
      navigate("/blogs"); // Navigate back to notes page after successful update
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  if (!isLoaded || loadingTopics || loadingBlog) {
    return <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />;
  }

  return (
    <div>
        <Header />
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8 mt-24">
        Edit Blog
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-4 pb-0"
      >
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input
              placeholder="Blog title"
              {...field}
            />
          )}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Controller
          name="author_name"
          control={control}
          render={({ field }) => (
            <Textarea
              placeholder="Authors Name"
              {...field}
            />
          )}
        />
        {errors.author_name && (
          <p className="text-red-500">{errors.author_name.message}</p>
        )}

        {/* <div className="flex items-center gap-4"> */}
          {/* <Controller
            name="topic_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by topics">
                    {field.value && topics
                      ? topics.find((topic) => topic.id.toString() === field.value)?.name
                      : "Topics"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {topics?.map(({ name, id }) => (
                      <SelectItem key={id} value={id.toString()}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <AddTopicDrawer fetchTopics={fnTopics} />
        </div> */}
        {/* {errors.topic_id && (
          <p className="text-red-500">{errors.topic_id.message}</p>
        )} */}

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MDEditor
              value={field.value}
              onChange={(value) => field.onChange(value || "")} // Ensure content is always a string
            />
          )}
        />
        {errors.content && (
          <p className="text-red-500">{errors.content.message}</p>
        )}

        {errorUpdateBlog && (
          <p className="text-red-500">{errorUpdateBlog.message}</p>
        )}

        {loadingUpdateBlog && <BarLoader className=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />}

        <div className="flex gap-4">
          <Button 
            type="submit" 
            variant="blue" 
            size="lg" 
            className="mt-2"
            disabled={loadingUpdateBlog || !isDirty}
          >
            Update Blog
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            size="lg" 
            className="mt-2"
            onClick={() => navigate("/blogs")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditBlog;