
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock, DollarSign, Calendar as CalendarIcon2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

interface JobApplicationFormProps {
  job: {
    id: string;
    title: string;
    facility: string;
    location: string;
    rate: string;
    shift: string;
    date: string;
    urgent?: boolean;
    description?: string;
  };
  onClose: () => void;
}

interface ApplicationFormValues {
  availableDates: Date[];
  notes: string;
  receiveUpdates: boolean;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ job, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ApplicationFormValues>({
    defaultValues: {
      availableDates: [new Date(job.date)],
      notes: "",
      receiveUpdates: true,
    },
  });

  const handleSubmit = async (values: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would submit to an API endpoint
      console.log("Submitting application:", {
        jobId: job.id,
        ...values,
        availableDates: values.availableDates.map(date => format(date, 'yyyy-MM-dd')),
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success("Application submitted successfully!");
      onClose();
    } catch (error) {
      console.error("Application submission error:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Apply for Position</CardTitle>
        <CardDescription>Submit your application for this job</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg">{job.title}</h3>
            {job.urgent && <Badge variant="destructive">Urgent</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">{job.facility}</p>
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{job.location}</span>
            </div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              <span className="font-medium text-green-600">{job.rate}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{job.shift}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon2 className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{format(new Date(job.date), 'EEEE, MMMM d, yyyy')}</span>
            </div>
          </div>
          {job.description && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm">{job.description}</p>
            </div>
          )}
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="availableDates"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Available Dates</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value?.length ? (
                            field.value.length > 1 ? (
                              `${field.value.length} dates selected`
                            ) : (
                              format(field.value[0], "PPP")
                            )
                          ) : (
                            <span>Select available dates</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="multiple"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Select one or more dates when you are available to work.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add any relevant information about your availability or qualifications..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Share any additional information that might be relevant to your application.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receiveUpdates"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Receive Updates</FormLabel>
                    <FormDescription>
                      Get notifications about the status of your application.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button 
          onClick={form.handleSubmit(handleSubmit)} 
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobApplicationForm;
