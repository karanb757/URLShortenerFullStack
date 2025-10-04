import { useEffect, useState, useRef } from "react";
import Error from "./error";
import { Input } from "./ui/input";
import * as Yup from "yup";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useNavigate, useSearchParams } from "react-router-dom";
import { signup } from "@/db/apiAuth";
import useFetch from "@/hooks/use-fetch";
import { UrlState } from "@/context";

const schema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  profile_pic: Yup.mixed()
});

const Signup = () => {
  let [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");

  const navigate = useNavigate();
  const { fetchUser } = UrlState();
  const hasNavigated = useRef(false); // ✅ Prevent multiple navigations

  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files) {
      // Convert image to base64
      const file = files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        setFormData((prevState) => ({
          ...prevState,
          [name]: reader.result, // base64 string
        }));
      };
      
      if (file) {
        reader.readAsDataURL(file);
      }
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const { loading, error, fn: fnSignup, data } = useFetch(signup, formData);

  // ✅ Fixed: Remove fetchUser from dependencies and use ref
  useEffect(() => {
    if (error === null && data && !hasNavigated.current) {
      hasNavigated.current = true;
      fetchUser();
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ""}`);
    }
  }, [error, data, navigate, longLink]); // Removed fetchUser

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrors({});
    
    try {
      await schema.validate(formData, { abortEarly: false });
      const { error } = await fnSignup();
      
      if (!error) {
        await fetchUser();
        navigate("/"); // Redirect to home page
      }
    } catch (e) {
      const newErrors = {};
      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>
          Create a new account if you haven&rsquo;t already
        </CardDescription>
        {error && <Error message={error} />}
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Input
            name="name"
            type="text"
            placeholder="Enter Name"
            className='border-2 border-black rounded-md'
            onChange={handleInputChange}
          />
        </div>
        {errors.name && <Error message={errors.name} />}
        
        <div className="space-y-1">
          <Input
            name="email"
            type="email"
            placeholder="Enter Email"
            className='border-2 border-black rounded-md'
            onChange={handleInputChange}
          />
        </div>
        {errors.email && <Error message={errors.email} />}
        
        <div className="space-y-1 pb-4">
          <Input
            name="password"
            type="password"
            placeholder="Enter Password"
            className='border-2 border-black rounded-md'
            onChange={handleInputChange}
          />
        </div>
        {errors.password && <Error message={errors.password} />}
        
        <div className="space-y-1">
          <input
            name="profile_pic"
            type="file"
            accept="image/*"
            onChange={handleInputChange}
          />
        </div>
        {errors.profile_pic && <Error message={errors.profile_pic} />}
      </CardContent>
      <CardFooter>
        <div className="border-2 border-black rounded-md scale-90 ">
        <Button onClick={handleSignup}>
        Create Account
        </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default Signup;