"use client";

import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ImageUploadField } from "./ImageUploadField";

interface CafeEditFormProps {
  setIsFileUploading: (isUploading: boolean) => void;
}

export const CafeEditForm: React.FC<CafeEditFormProps> = ({
  setIsFileUploading,
}) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
    <div className="xl:col-span-2 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Core Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cafe Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="tagline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tagline</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="instaID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Instagram Handle</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="openingTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Hours</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Financial</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              name="gstNo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Number</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="gstPercentage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GST Rate (%)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="payment_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payment URL</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>

    <div className="xl:col-span-1 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUploadField
            name="logoUrl"
            label="Logo"
            description="Square (1:1)"
            setIsFileUploading={setIsFileUploading}
          />
          <ImageUploadField
            name="bannerUrl"
            label="Banner"
            description="Wide (16:9)"
            setIsFileUploading={setIsFileUploading}
            isWide
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FormField
            name="is_active"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <FormLabel>Cafe Active</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="isPureVeg"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <FormLabel>Pure Veg</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  </div>
);
