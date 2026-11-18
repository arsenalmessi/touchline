
import { Pencil, Upload } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

export default function ImageInput({
  label,
  imageUrl = "",
  setImageUrl,
  className = "col-span-full",
  endpoint = "",
}: {
  label: string;
  imageUrl: string;
  setImageUrl: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  className?: string;
  endpoint: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}) {
  return (
    <div className={`${className} transition-all duration-300`}>
    <div className="flex justify-between items-center mb-4">
      <label
        htmlFor="course-image"
        className="block text-sm font-medium leading-6 text-indigo-700 dark:text-indigo-300 mb-2"
      >
        {label}
      </label>
      {imageUrl && (
        <button
          onClick={() => setImageUrl("")}
          type="button"
          className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 rounded-md shadow text-white py-2 px-4 transition-colors duration-200"
        >
          <Pencil className="w-4 h-4" />
          <span className="text-gray-900">Change Image</span>
        </button>
      )}
    </div>
    
    {imageUrl ? (
      <div className="relative rounded-lg overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 shadow-md">
        <Image
          src={imageUrl}
          alt="Item image"
          width={1000}
          height={667}
          className="w-full h-64 object-contain"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    ) : (
      <div className="border-2 border-dashed border-indigo-300 dark:border-indigo-700 rounded-lg">
        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
       
        </div>
      </div>
    )}
  </div>
  );
}
