"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TableFormData {
  name: string;
  location?: string;
  condition?: string;
  status?: string;
}

interface TableFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TableFormData) => Promise<void>;
  initialData?: TableFormData;
  title: string;
  description: string;
}

export function TableFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  description,
}: TableFormDialogProps) {
  const t = useTranslations("table");
  const [formData, setFormData] = useState<TableFormData>({
    name: "",
    location: "",
    condition: "BON",
    status: "AVAILABLE",
  });
  const [isLoading, setIsLoading] = useState(false);

  const TABLE_CONDITIONS = [
    { value: "EXCELLENT", label: t("excellent") },
    { value: "BON", label: t("good") },
    { value: "MOYEN", label: t("average") },
    { value: "MAINTENANCE", label: t("maintenance") },
  ];

  const TABLE_STATUSES = [
    { value: "AVAILABLE", label: t("available") },
    { value: "OCCUPIED", label: t("occupied") },
    { value: "MAINTENANCE", label: t("maintenance") },
  ];

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: "",
        location: "",
        condition: "BON",
        status: "AVAILABLE",
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit(formData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t("name")} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder={t("namePlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t("location")}</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder={t("locationPlaceholder")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">{t("condition")}</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) =>
                setFormData({ ...formData, condition: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectCondition")} />
              </SelectTrigger>
              <SelectContent>
                {TABLE_CONDITIONS.map((condition) => (
                  <SelectItem key={condition.value} value={condition.value}>
                    {condition.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t("status")}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                {TABLE_STATUSES.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t("saving")
                : initialData
                ? t("update")
                : t("create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
