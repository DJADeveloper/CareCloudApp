"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import InputField from "../InputField";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext"; // Import AppContext
import { Resident } from "@/types/types";

const schema = z.object({
  fullName: z.string().min(1, { message: "Full name is required!" }),
  email: z.string().email({ message: "Invalid email address!" }).optional(),
  phone: z.string().min(1, { message: "Phone is required!" }),
  address: z.string().min(1, { message: "Address is required!" }),
  // gender: z
  //   .enum(["M", "F", "Other"], {
  //     message: "Gender is required!",
  //   })
  //   .optional(), // Make gender optional
  dateOfBirth: z.preprocess(
    (value) => (typeof value === "string" ? new Date(value) : value),
    z.date({ message: "Date of birth is required!" })
  ), // Converts string to Date
  pcp: z.string().min(1, { message: "Primary Care Physician is required!" }),
  photo: z.any().optional(), // Make photo optional
  emergencyContactName: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  dncConsent: z.boolean().optional(),
  healthConditions: z.string().optional(),
});

type Inputs = z.infer<typeof schema>;

const ResidentForm = ({
  type,
  data,
}: {
  type: "create" | "update";
  data?: any;
}) => {
  const { addResident, uploadImageForResident } = useAppContext(); // Access AppContext functions

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });

  const onSubmit = handleSubmit(async (formData) => {
    try {
      // Transform data for Date and Gender fields
      const transformedData = {
        ...formData,
        dateOfBirth: formData.dateOfBirth
          ? new Date(formData.dateOfBirth)
          : null, // Ensure Date of Birth is a Date object
        photo: formData.photo?.[0] || null, // Handle file input
        // gender: formData.gender as "M" | "F" | "Other", // Explicit type assertion
      };

      // Log the transformed data for debugging
      console.log("Transformed Data:", transformedData);

      // Upload the photo if it exists
      let photoUrl = null;
      if (transformedData.photo) {
        photoUrl = await uploadImageForResident(
          transformedData.fullName,
          transformedData.photo
        );
      }

      // Prepare the final data to send to Firebase
      const residentData: Omit<Resident, "id"> = {
        ...transformedData,
        photo: photoUrl || "", // Ensure photo is a string
        // gender: transformedData.gender || "", // Ensure it's correctly typed
      };

      // Call the addResident function
      const newResident = await addResident(residentData);

      // Success notification
      console.log("Resident created:", newResident);
      alert("Resident created successfully!");
    } catch (error) {
      // Handle errors
      console.error("Error creating resident:", error);
      alert("Failed to create resident. Please try again.");
    }
  });

  return (
    <form className="flex flex-col gap-8" onSubmit={onSubmit}>
      <h1 className="text-xl font-semibold">
        {type === "create" ? "Create a new resident" : "Update resident"}
      </h1>
      <div className="flex justify-between flex-wrap gap-4">
        <InputField
          label="Full Name"
          name="fullName"
          defaultValue={data?.fullName}
          register={register}
          error={errors?.fullName}
        />
        <InputField
          label="Email"
          name="email"
          defaultValue={data?.email}
          register={register}
          error={errors?.email}
        />
        <InputField
          label="Phone"
          name="phone"
          defaultValue={data?.phone}
          register={register}
          error={errors?.phone}
        />
        <InputField
          label="Address"
          name="address"
          defaultValue={data?.address}
          register={register}
          error={errors?.address}
        />
        <InputField
          label="Primary Care Physician"
          name="pcp"
          defaultValue={data?.pcp}
          register={register}
          error={errors?.pcp}
        />
        <InputField
          label="Date of Birth"
          name="dateOfBirth"
          defaultValue={data?.dateOfBirth}
          register={register}
          error={errors?.dateOfBirth}
          type="date"
        />
        {/* <div className="flex flex-col gap-2 w-full md:w-1/4">
          <label className="text-xs text-gray-500">Gender</label>
          <select
            className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm w-full"
            {...register("gender")}
            defaultValue={data?.gender || ""}
          >
            <option value="">Select Gender</option> 
            <option value="M">Male</option>
            <option value="F">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender?.message && (
            <p className="text-xs text-red-400">
              {errors.gender.message.toString()}
            </p>
          )}
        </div> */}

        <div className="flex flex-col gap-2 w-full md:w-1/4 justify-center">
          <label
            className="text-xs text-gray-500 flex items-center gap-2 cursor-pointer"
            htmlFor="photo"
          >
            <Image src="/upload.png" alt="" width={28} height={28} />
            <span>Upload a photo</span>
          </label>
          <input
            type="file"
            id="photo"
            {...register("photo")}
            className="hidden"
          />
          {errors.photo?.message && (
            <p className="text-xs text-red-400">
              {errors.photo.message.toString()}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-4">
        <InputField
          label="Emergency Contact Name"
          name="emergencyContactName"
          defaultValue={data?.emergencyContactName}
          register={register}
          error={errors?.emergencyContactName}
        />
        <InputField
          label="Emergency Contact Number"
          name="emergencyContactNumber"
          defaultValue={data?.emergencyContactNumber}
          register={register}
          error={errors?.emergencyContactNumber}
        />
        <InputField
          label="Emergency Contact Relationship"
          name="emergencyContactRelationship"
          defaultValue={data?.emergencyContactRelationship}
          register={register}
          error={errors?.emergencyContactRelationship}
        />
        <InputField
          label="Health Conditions"
          name="healthConditions"
          defaultValue={data?.healthConditions}
          register={register}
          error={errors?.healthConditions}
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">
            Do Not Resuscitate Consent
          </label>
          <input
            type="checkbox"
            {...register("dncConsent")}
            defaultChecked={data?.dncConsent}
          />
        </div>
      </div>
      <button className="bg-blue-400 text-white p-2 rounded-md">
        {type === "create" ? "Create" : "Update"}
      </button>
    </form>
  );
};

export default ResidentForm;
