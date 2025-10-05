// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import Error from "./error";
// import * as yup from "yup";
// import useFetch from "@/hooks/use-fetch";
// import { createUrl } from "@/db/apiUrls";
// import { BeatLoader } from "react-spinners";
// import { UrlState } from "@/context";

// export function CreateLink() {
//   const { user } = UrlState();
//   // FIX: Changed from user?.user?.id to user?.id
//   const userId = user?.id;

//   const navigate = useNavigate();
//   let [searchParams, setSearchParams] = useSearchParams();
//   const longLink = searchParams.get("createNew");

//   const [errors, setErrors] = useState({});
//   const [formValues, setFormValues] = useState({
//     title: "",
//     longUrl: longLink ? longLink : "",
//     customUrl: "",
//   });

//   // Validation schema
//   const schema = yup.object().shape({
//     title: yup.string().required("Title is required"),
//     longUrl: yup
//       .string()
//       .url("Must be a valid URL")
//       .required("Long URL is required"),
//     customUrl: yup.string(),
//   });

//   const handleChange = (e) => {
//     setFormValues({
//       ...formValues,
//       [e.target.id]: e.target.value,
//     });
//   };

//   const {
//     loading,
//     error,
//     data,
//     fn: fnCreateUrl,
//   } = useFetch(createUrl, { ...formValues, user_id: userId });

//   // Navigate after creating link
//   useEffect(() => {
//     if (error === null && data) {
//       // data could be object or array, so check
//       const linkId = Array.isArray(data) ? data[0]?.id : data?.id;
//       if (linkId) {
//         navigate(`/link/${linkId}`);
//       }
//     }
//   }, [error, data, navigate]);

//   const createNewLink = async () => {
//     setErrors({});
    
//     // FIX: Better user check
//     if (!userId) {
//       setErrors({ auth: "You must be logged in to create a link." });
//       return;
//     }

//     try {
//       await schema.validate(formValues, { abortEarly: false });
//       await fnCreateUrl();
//     } catch (e) {
//       const newErrors = {};
//       e?.inner?.forEach((err) => {
//         newErrors[err.path] = err.message;
//       });
//       setErrors(newErrors);
//     }
//   };

//   return (
//     <Dialog
//       defaultOpen={longLink}
//       onOpenChange={(res) => {
//         if (!res) setSearchParams({});
//       }}
//     >
//       <DialogTrigger asChild>
//         <Button className="bg-[#7f57f1]" variant="destructive">
//           Create New Link
//         </Button>
//       </DialogTrigger>

//       <DialogContent className="sm:max-w-md bg-white rounded-none">
//         <DialogHeader>
//           <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
//         </DialogHeader>

//         <Input
//           id="title"
//           placeholder="Short Link Title"
//           value={formValues.title}
//           onChange={handleChange}
//           className="bg-white text-black border-2 border-gray-400 rounded-none px-3 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
//           />
//         {errors.title && <Error message={errors.title} />}

//         <Input
//           id="longUrl"
//           placeholder="Enter your Long URL"
//           value={formValues.longUrl}
//           onChange={handleChange}
//           className="bg-white text-black border-2 border-gray-400 rounded-none px-3 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
//           />
//         {errors.longUrl && <Error message={errors.longUrl} />}

//         <div className="flex items-center gap-2">
//         <Input
//           id="customUrl"
//           placeholder="Custom Link (optional)"
//           value={formValues.customUrl}
//           onChange={handleChange}
//           className="bg-white text-black border-2 border-gray-400 rounded-none px-3 py-2 focus:border-black focus:ring-1 focus:ring-black outline-none transition"
//         />
//       </div>


//         {/* Errors */}
//         {errors.auth && <Error message={errors.auth} />}
//         {error && <Error message={error} />}

//         <DialogFooter className="sm:justify-start">
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={createNewLink}
//             className='bg-[#7f57f1]'
//             disabled={loading}
//           >
//             {loading ? <BeatLoader size={10} color="white" /> : "Create"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }