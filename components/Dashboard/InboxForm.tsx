
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import type { Session } from "next-auth";

import { createInboxMessage } from "@/actions/inbox";
import type { InboxProps } from "@/types/types";

import TextInput from "../FormInputs/TextInput";
import SubmitButton from "../FormInputs/SubmitButton";
import FormSelectInput from "../FormInputs/FormSelectInput";

export type CustomOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type CustomOptions = CustomOption[];

interface InboxFormProps {
  title: string;
  initialData?: InboxProps;
  users: CustomOptions;
  session: Session | null;
}

export default function InboxForm({
  title,
  initialData,
  users,
  session,
}: InboxFormProps) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<CustomOption | null>(
    initialData
      ? users.find((user) => user.value === initialData.recipientId) ?? null
      : null
  );
  const [content, setContent] = useState(initialData?.body ?? "");

  const editingId = initialData && "id" in initialData
    ? initialData.id
    : "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InboxProps>({
    defaultValues: {
      subject: initialData?.subject ?? "",
    },
  });


  async function onSubmit(data: InboxProps) {
    if (!selectedUser) {
      toast.error("Please select a recipient");
      return;
    }
  
    if (!content.replace(/<[^>]*>/g, "").trim()) {
      toast.error("Please write a message");
      return;
    }
  
    setIsLoading(true);
  
    try {
    
const messageData: InboxProps = {
  ...data,
  recipientId: selectedUser.value,
  senderId: session?.user?.id ?? "",
  senderName: session?.user?.name ?? "",
  senderEmail: session?.user?.email ?? "",
  body: content,
};

  
      const res = await createInboxMessage(messageData);
  
     
if (res.status === 201) {
  reset();
  setContent("");
  setSelectedUser(null);

  toast.success("Message sent successfully");

  const role = session?.user?.role;

  if (role === "CLIENT") {
    router.push(
      `/dashboard/user/inbox?workerId=${selectedUser.value}`
    );
  } else if (role === "WORKER") {
    router.push(
      `/dashboard/inbox?clientId=${selectedUser.value}`
    );
  }

  router.refresh();
} else {
  toast.error(res.error || "Unable to send message.");
}

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong while sending your message.");
    } finally {
      setIsLoading(false);
    }
  }
  

  const cancelHref =
    session?.user?.role === "WORKER"
      ? "/dashboard/inbox"
      : "/dashboard/user/inbox";

  return (
    <div className="mx-auto my-6 w-full max-w-3xl overflow-hidden rounded-2xl border border-[#2a2318] bg-[#0c0a08] shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#2a2318] px-6 py-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8924a]">
            Messages
          </p>
          <h1 className="mt-1 text-xl font-semibold text-[#f0ebe0]">
            {title}
          </h1>
        </div>

        <Link
          href={cancelHref}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2318] text-[#a89880] transition hover:border-[#b8924a] hover:text-[#d4af71]"
          aria-label="Close"
        >
          <X size={17} />
        </Link>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 p-6"
      >
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#c9bda9]">
              Recipient
            </label>

            <FormSelectInput
              label="Select recipient"
              options={users}
              option={selectedUser}
              setOption={setSelectedUser}
            />
          </div>

          <div>
            <TextInput
              label="Subject"
              register={register}
              name="subject"
              errors={errors}
              placeholder="Enter message subject"
            />
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium text-[#c9bda9]">
              Message
            </label>

            <div className="inbox-quill overflow-hidden rounded-xl border border-[#2a2318] bg-[#100e0b]">
              <ReactQuill
                value={content}
                onChange={setContent}
                theme="snow"
                placeholder="Write your message here..."
                className="min-h-[220px] text-[#f0ebe0]"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col-reverse justify-between gap-3 border-t border-[#2a2318] pt-5 sm:flex-row">
          <Link
            href={cancelHref}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-[#2a2318] px-5 text-sm font-medium text-[#a89880] transition hover:border-[#b8924a] hover:text-[#f0ebe0]"
          >
            Cancel
          </Link>

          <div className="flex items-center gap-2">
            <SubmitButton
              title={editingId ? "Update Message" : "Send Message"}
              isLoading={isLoading}
              loadingTitle={
                editingId
                  ? "Updating..."
                  : "Sending..."
              }
            />
          </div>
        </div>
      </form>

      <style jsx global>{`
        .inbox-quill .ql-toolbar {
          border: none;
          border-bottom: 1px solid #2a2318;
          background: #100e0b;
        }

        .inbox-quill .ql-container {
          border: none;
          min-height: 220px;
          font-family: inherit;
          font-size: 14px;
        }

        .inbox-quill .ql-editor {
          min-height: 220px;
          color: #f0ebe0;
        }

        .inbox-quill .ql-editor.ql-blank::before {
          color: #6b5e50;
          font-style: normal;
        }

        .inbox-quill .ql-stroke {
          stroke: #a89880;
        }

        .inbox-quill .ql-fill {
          fill: #a89880;
        }

        .inbox-quill .ql-picker {
          color: #a89880;
        }

        .inbox-quill .ql-picker-options {
          background: #100e0b;
          border-color: #2a2318;
        }

        .inbox-quill .ql-picker-item {
          color: #f0ebe0;
        }

        .inbox-quill .ql-toolbar button:hover .ql-stroke,
        .inbox-quill .ql-toolbar button.ql-active .ql-stroke {
          stroke: #d4af71;
        }
      `}</style>
    </div>
  );
}
