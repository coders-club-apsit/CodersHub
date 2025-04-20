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
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { updateResource, getSingleResource } from "@/api/api-resources";
import { useNavigate, useParams } from "react-router-dom";
import AddTopicDrawer from "@/components/add-topic-drawer";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  topic_id: z.string().min(1, { message: "Select or add a new topic" }),
  content: z.string().optional(),
});

const EditResources = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const { resourceId } = useParams();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      topic_id: "",
      content: "",
    },
  });

  const {
    fn: fnTopics,
    data: topics,
    loading: loadingTopics,
  } = useFetch(getTopics);

  const {
    fn: fnGetResource,
    data: resource,
    loading: loadingResource,
  } = useFetch(getSingleResource, { resource_id: resourceId });

  const {
    fn: fnUpdateResource,
    loading: loadingUpdateResource,
    error: errorUpdateResource,
  } = useFetch(updateResource);

  useEffect(() => {
    if (isLoaded) {
      fnTopics();
      fnGetResource();
    }
  }, [isLoaded]);

  useEffect(() => {
    if (resource) {
      reset({
        title: resource.title || "",
        description: resource.description || "",
        topic_id: resource.topic_id ? resource.topic_id.toString() : "",
        content: resource.content || "",
      });
    }
  }, [resource, reset]);
  useEffect(() => {
    console.log("Resource data:", resource);
  }, [resource]);

  const onSubmit = async (data) => {
    try {
      const payload = {
        id: resourceId,
        title: data.title,
        description: data.description,
        topic_id: data.topic_id,
        content: data.content || "",
        recruiter_id: user.id,
      };

      await fnUpdateResource(payload);
      navigate("/resources");
    } catch (error) {
      console.error("Error updating resource:", error);
    }
  };

  if (!isLoaded || loadingTopics || loadingResource) {
    return <BarLoader className="mb-4 bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Edit Resource
      </h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-4 pb-0">
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input placeholder="Resource title" {...field} />
          )}
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea placeholder="Resource Description" {...field} />
          )}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <div className="flex items-center gap-4">
          <Controller
            name="topic_id"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
        </div>
        {errors.topic_id && <p className="text-red-500">{errors.topic_id.message}</p>}

        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <MDEditor value={field.value} onChange={(value) => field.onChange(value || "")} />
          )}
        />
        {errors.content && <p className="text-red-500">{errors.content.message}</p>}

        {errorUpdateResource && <p className="text-red-500">{errorUpdateResource.message}</p>}
        {loadingUpdateResource && <BarLoader wclassName=" bg-gradient-to-r from-blue-400 to-cyan-400" width="100%" />}

        <div className="flex gap-4">
          <Button
            type="submit"
            variant="blue"
            size="lg"
            className="mt-2"
            disabled={loadingUpdateResource || !isDirty}
          >
            Update Resource
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="mt-2"
            onClick={() => navigate("/resources")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditResources;