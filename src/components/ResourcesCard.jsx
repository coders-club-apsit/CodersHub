// eslint-disable react/prop-types
import { useUser } from "@clerk/clerk-react";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Heart, Trash2Icon, PenBox } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { deleteResource, saveResource } from "@/api/api-resources";
import { BarLoader } from "react-spinners";

const ResourcesCard = ({
  resource,
  isMyResource = false,
  savedInit = false,
  onResourceSaved = () => {},
  onResourceDeleted = () => {},
}) => {
  const [saved, setSaved] = useState(savedInit);
  const { user } = useUser();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const ADMIN_EMAILS = [
    "yadnesh2105@gmail.com",
    "cyption.one@gmail.com",
    "abhishekmt2004@gmail.com",
    "avanishvadke001@gmail.com",
    "atharvashelke2303@gmail.com",
    "vedantshinde2066@gmail.com",
    "dasparth1544@gmail.com",
    "aarya.bivalkar1605@gmail.com",
    "gaikwadnayan2004@gmail.com",
    "abdulkhan13114@gmail.com",
    "moresarakshi@gmail.com",
    "nikhilbhosale7960@gmail.com",
    "zahidhamdule12@gmail.com",
    "durva.waghchaure1102@gmail.com",
    "oveedolkar@gmail.com",
    "nishilrathod2512@gmail.com",
  ]; // List of admin emails

  const {
    fn: fnSavedResources,
    data: savedResources,
    loading: loadingSavedResources,
  } = useFetch(saveResource, { alreadySaved: saved });

  const { fn: fnDeleteResource, loading: loadingDeleteResource } = useFetch(deleteResource);

  const handleSaveResource = async () => {
    await fnSavedResources({ user_id: user.id, resource_id: resource.id });
    onResourceSaved();
  };

  const handleDeleteResource = async () => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      const response = await fnDeleteResource({ resource_id: resource.id });
      if (response) {
        onResourceDeleted();
      }
    }
  };

  const handleEditClick = (e) => {
    e.preventDefault();
    navigate(`/resource/edit/${resource.id}`);
  };

  useEffect(() => {
    if (savedResources !== undefined) setSaved(savedResources?.length > 0);
  }, [savedResources]);

  useEffect(() => {
    if (user && user.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress.toLowerCase();
      setIsAdmin(
        ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email)
      );
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <Card className="flex flex-col">
      {loadingDeleteResource && (
        <BarLoader className="mt-4" width={"100%"} color="#36d7b7" />
      )}
      <CardHeader>
        <CardTitle className="flex items-center justify-between font-bold">
          <span>{resource.title}</span>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={handleEditClick}
              >
                <PenBox className="h-4 w-4 text-blue-500 hover:text-blue-600" />
              </Button>
            )}
            {!isMyResource && (
              <Button
                variant="ghost"
                className="w-5"
                onClick={handleSaveResource}
                disabled={loadingSavedResources}
              >
                {saved ? (
                  <Heart size={20} stroke="red" fill="red" />
                ) : (
                  <Heart size={20} />
                )}
              </Button>
            )}
            {isMyResource && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 p-0"
                onClick={handleDeleteResource}
              >
                <Trash2Icon className="h-4 w-4 text-red-500 hover:text-red-600" />
              </Button>
            )}
          </div>
        </CardTitle>
        {resource.last_edited_by && (
          <div className="text-sm text-gray-500">
            Last edited by: {resource.last_edited_by}
          </div>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 flex-1">
        <div className="flex justify-between">
          {resource.topic && (
            <img
              src={resource.topic.topic_logo_url}
              alt="topic"
              className="h-20"
            />
          )}
        </div>
        <hr />
        {resource.description.substring(0, resource.description.indexOf(".") + 1)}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Link to={`/resource/${resource.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">
            More Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ResourcesCard;
