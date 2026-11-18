import { getWorkerBookings } from "@/actions/bookings";
import { getDoctorById, getDoctorProfile } from "@/actions/users";
import ApproveBtn from "@/components/Dashboard/ApproveBtn";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getNormalDate } from "@/utils/getNormalDate";
import {
  AlertTriangle,
  History,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  FileText,
  Clock,
  Users,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import SubHeading from "@/components/SubHeading";

// HTML escaping utility function
const escapeHtml = (text: string | number | null | undefined): string => {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

// Safe text component
const SafeText = ({ children, className = "" }: { children: string | null | undefined; className?: string }) => {
  return <span className={className}>{escapeHtml(children)}</span>;
};

// Safe URL validation for document links
const isValidUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export default async function DoctorDetailsPage(props: any) { // eslint-disable-line @typescript-eslint/no-explicit-any
  // Await params before using it
  const { id } = await props.params;
  
  const appointments = (await getWorkerBookings(id)).data || [];
  const doctor = await getDoctorById(id);
  const WorkerProfile = await getDoctorProfile(id);
  const status = WorkerProfile?.status ?? "PENDING";
  const dob = WorkerProfile?.dob ?? "1992-05-13T21:00:00.000Z";
  const expiry =
    WorkerProfile?.medicalLicenseExpiry ?? "1992-05-13T21:00:00.000Z";
  
  if (!WorkerProfile) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center p-4">
        <div className="space-y-4 text-center flex items-center justify-center flex-col max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500" />
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-2">No Profile Found</h2>
            <p className="text-slate-600">The doctor profile you are looking for does not exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          
          {/* Header Section - Improved Mobile Layout */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8 border-b border-slate-200">
            <div className="flex flex-col space-y-4 lg:flex-row lg:items-start lg:justify-between lg:space-y-0">
              
              {/* Doctor Info */}
              <div className="flex-1">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 break-words">
                      <SafeText>{doctor?.name}</SafeText>
                    </h1>
                    <div className="mt-2 space-y-1 sm:space-y-2">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-600">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <SafeText className="break-all">{doctor?.email}</SafeText>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4 flex-shrink-0" />
                          <SafeText>{doctor?.phone}</SafeText>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:flex-col lg:items-end">
                <ApproveBtn status={status} profileId={WorkerProfile?.id ?? ""} />
                <div className="flex items-center justify-center sm:justify-start lg:justify-end space-x-2 px-3 py-2 bg-white/60 rounded-lg border border-slate-200">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span className="text-sm text-slate-600">
                    <span className="font-semibold">{appointments.length.toString().padStart(2, "0")}</span> Appointments
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section - Mobile Optimized */}
          <div className="p-4 sm:p-6 lg:p-8">
            <Tabs defaultValue="details" className="w-full">
              
              {/* Mobile-First Tab Navigation */}
              <div className="mb-6 overflow-x-auto">
                <TabsList className="inline-flex h-auto p-1 bg-slate-100 rounded-lg w-full sm:w-auto min-w-max">
                  <TabsTrigger 
                    value="details" 
                    className="flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">Professional</span>
                    <span className="sm:hidden">Details</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="education" 
                    className="flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Education</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="practice" 
                    className="flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Briefcase className="w-4 h-4" />
                    <span>Practice</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="additional" 
                    className="flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <FileText className="w-4 h-4" />
                    <span className="hidden sm:inline">Additional</span>
                    <span className="sm:hidden">More</span>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="appointments" 
                    className="flex items-center space-x-2 px-3 py-2 text-xs sm:text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:shadow-sm"
                  >
                    <Calendar className="w-4 h-4" />
                    <span className="hidden sm:inline">Appointments</span>
                    <span className="sm:hidden">Appts</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Details Tab - Enhanced Mobile Layout */}
              <TabsContent value="details" className="space-y-6 sm:space-y-8">
                
                {/* Bio Data */}
                <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                  <SubHeading title="Bio Data" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
                    {[
                      { label: "First Name", value: WorkerProfile?.firstName, icon: User },
                      { label: "Last Name", value: WorkerProfile?.lastName, icon: User },
                      { label: "Middle Name", value: WorkerProfile?.middleName, icon: User },
                      { label: "Date of Birth", value: getNormalDate(dob as string), icon: Calendar },
                      { label: "Gender", value: WorkerProfile?.gender, icon: User },
                    ].map(({ label, value, icon: Icon }, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-600">{label}</span>
                        </div>
                        <SafeText className="text-base text-slate-900 font-medium">{value || "Not specified"}</SafeText>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Profile Information */}
                <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                  <SubHeading title="Profile Information" />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">Medical License</span>
                      </div>
                      <SafeText className="text-base text-slate-900 font-medium">{WorkerProfile?.medicalLicense || "Not provided"}</SafeText>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-slate-200">
                      <div className="flex items-center space-x-2 mb-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-medium text-slate-600">Age</span>
                      </div>
                      <p className="text-base text-slate-900 font-medium">{WorkerProfile?.age || "Not specified"} years</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 bg-white rounded-lg p-4 border border-slate-200">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <span className="text-sm font-medium text-slate-600">Medical License Expiry</span>
                    </div>
                    <SafeText className="text-base text-slate-900 font-medium">{getNormalDate(expiry as string) || "Not provided"}</SafeText>
                    {WorkerProfile?.bio && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm font-medium text-slate-600 mb-2">Bio</p>
                        <p className="text-slate-700 leading-relaxed"><SafeText>{WorkerProfile.bio}</SafeText></p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-slate-50 rounded-xl p-4 sm:p-6">
                  <SubHeading title="Contact Information" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4">
                    {[
                      { label: "Email Address", value: WorkerProfile?.email, icon: Mail },
                      { label: "Phone", value: WorkerProfile?.phone, icon: Phone },
                      { label: "City", value: WorkerProfile?.city, icon: MapPin },
                      { label: "State", value: WorkerProfile?.state, icon: MapPin },
                    ].map(({ label, value, icon: Icon }, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-slate-200">
                        <div className="flex items-center space-x-2 mb-2">
                          <Icon className="w-4 h-4 text-slate-500" />
                          <span className="text-sm font-medium text-slate-600">{label}</span>
                        </div>
                        <SafeText className="text-base text-slate-900 font-medium break-all">{value || "Not provided"}</SafeText>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education" className="space-y-6 sm:space-y-8">
               
              </TabsContent>

         

           
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}