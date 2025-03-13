// import React from "react";
// import { useEffect } from "react";
// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { Input } from "@/components/ui/input";
// import useFetch from "@/hooks/use-fetch";
// import { addNewTopic } from "@/api/api-topics";
// import { BarLoader } from "react-spinners";

// const schema = z.object({
//   name: z.string().min(1, { message: "Company name is required" }),
//   logo: z
//     .any()
//     .refine(
//       (file) =>
//         file[0] &&
//         (file[0].type === "image/png" || file[0].type === "image/jpeg"),
//       {
//         message: "Only Images are allowed",
//       }
//     ),
// });

// const AddTopicDrawer = ({fetchTopics}) => {
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(schema),
//   });

//   const{
//     loading: loadingAddTopic,
//     error: errorAddTopic,
//     data: dataAddTopic,
//     fn: fnAddTopic,
//   }= useFetch(addNewTopic);


//   const onSubmit = (data)=>{
//     fnAddTopic({
//         ...data,
//         logo: data.logo[0]
//     })
//   }

//   useEffect(() => {
//     if(dataAddTopic?.length > 0) fetchTopics();
//   }, [loadingAddTopic])

//   return (
//     <Drawer>
//       <DrawerTrigger>
//         <Button type="button" size="sm" variant="secondary">
//           Add topic
//         </Button>
//       </DrawerTrigger>
//       <DrawerContent>
//         <DrawerHeader>
//           <DrawerTitle>Add a new topic</DrawerTitle>
//         </DrawerHeader>
//         <form className="flex gap-2 p-4 pb-0">
//           <Input placeholder="Topic Name" {...register("name")} />
//           <Input
//             type="file"
//             accept="image/*"
//             className="file:text-gray-500"
//             {...register("logo")}
//           />

//           <Button type="button" onClick={handleSubmit(onSubmit)} variant="destructive" className="w-40">
//             Add
//           </Button>
//         </form>
//         {errors.name && <p className="text-red-500">{errors.name.message}</p>}
//         {errors.logo && <p className="text-red-500">{errors.logo.message}</p>}
        
//         {errorAddTopic?.message && (
//           <p className="text-red-500">{errorAddTopic?.message}</p>
//         )}

//         {loadingAddTopic && <BarLoader width={"100%"} color="#36d7b7" />}
//         <DrawerFooter>
//           <DrawerClose asChild>
//             <Button variant="secondary" type="button">Cancel</Button>
//           </DrawerClose>
//         </DrawerFooter>
//       </DrawerContent>
//     </Drawer>
//   );
// };

// export default AddTopicDrawer;


import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import useFetch from "@/hooks/use-fetch";
import { addNewTopic } from "@/api/api-topics";
import { BarLoader } from "react-spinners";

const schema = z.object({
  name: z.string().min(1, { message: "Topic name is required" }),
  logo: z
    .any()
    .refine(
      (file) =>
        file[0] &&
        (file[0].type === "image/png" || file[0].type === "image/jpeg"),
      {
        message: "Only PNG and JPEG images are allowed",
      }
    ),
});

const AddTopicDrawer = ({ fetchTopics }) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
  });

  const {
    loading: loadingAddTopic,
    error: errorAddTopic,
    data: dataAddTopic,
    fn: fnAddTopic,
  } = useFetch(addNewTopic);

  const onSubmit = (data) => {
    fnAddTopic({
      ...data,
      logo: data.logo[0],
    });
  };

  useEffect(() => {
    if (dataAddTopic?.length > 0) {
      fetchTopics();
      reset(); // Reset form after successful submission
    }
  }, [dataAddTopic, loadingAddTopic]);

  return (
    <Drawer>
      <DrawerTrigger>
        <Button type="button" size="sm" variant="secondary">
          Add Topic
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add a new topic</DrawerTitle>
          <DrawerDescription>
            Add a new topic with a logo. Supported formats: PNG, JPEG
          </DrawerDescription>
        </DrawerHeader>
        <form className="flex flex-col gap-4 p-4 pb-0">
          <div>
            <Input placeholder="Topic Name" {...register("name")} />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <Input
              type="file"
              accept="image/png,image/jpeg"
              className="file:text-gray-500"
              {...register("logo")}
            />
            {errors.logo && (
              <p className="text-red-500 text-sm mt-1">{errors.logo.message}</p>
            )}
          </div>

          {errorAddTopic?.message && (
            <p className="text-red-500 text-sm">{errorAddTopic?.message}</p>
          )}

          {loadingAddTopic && <BarLoader width={"100%"} color="#36d7b7" />}

          <div className="flex gap-2 justify-end mt-4">
            <DrawerClose asChild>
              <Button variant="secondary" type="button">
                Cancel
              </Button>
            </DrawerClose>
            <Button
              type="button"
              onClick={handleSubmit(onSubmit)}
              variant="destructive"
            >
              Add Topic
            </Button>
          </div>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AddTopicDrawer;