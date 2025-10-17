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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReservationFormData {
  babyfootId: string;
  partyDate: string;
  refereeId?: string | null;
  redDefenseId?: string | null;
  redAttackId?: string | null;
  blueDefenseId?: string | null;
  blueAttackId?: string | null;
}

interface BabyfootTable {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
}

interface ReservationFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ReservationFormData) => Promise<void>;
  initialData?: Partial<ReservationFormData>;
  title: string;
  description: string;
  tables: BabyfootTable[];
  players: Player[];
  disableTableSelection?: boolean;
}

export function ReservationFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  title,
  description,
  tables,
  players,
  disableTableSelection = false,
}: ReservationFormDialogProps) {
  const t = useTranslations("reservation");
  const tCommon = useTranslations("common");

  const [formData, setFormData] = useState<ReservationFormData>({
    babyfootId: "",
    partyDate: new Date().toISOString(),
    refereeId: null,
    redDefenseId: null,
    redAttackId: null,
    blueDefenseId: null,
    blueAttackId: null,
  });

  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState("12:00");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        babyfootId: initialData.babyfootId || "",
        partyDate: initialData.partyDate || new Date().toISOString(),
        refereeId: initialData.refereeId,
        redDefenseId: initialData.redDefenseId,
        redAttackId: initialData.redAttackId,
        blueDefenseId: initialData.blueDefenseId,
        blueAttackId: initialData.blueAttackId,
      });
      if (initialData.partyDate) {
        const d = new Date(initialData.partyDate);
        setDate(d);
        setTime(format(d, "HH:mm"));
      }
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const [hours, minutes] = time.split(":");
      const submissionDate = new Date(date);
      submissionDate.setHours(parseInt(hours), parseInt(minutes));

      await onSubmit({
        ...formData,
        partyDate: submissionDate.toISOString(),
      });
      onOpenChange(false);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Table Selection */}
          <div className="space-y-2">
            <Label htmlFor="babyfootId">{t("babyfoot")} *</Label>
            <Select
              value={formData.babyfootId}
              onValueChange={(value) =>
                setFormData({ ...formData, babyfootId: value })
              }
              required
              disabled={disableTableSelection}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectTable")} />
              </SelectTrigger>
              <SelectContent>
                {tables.map((table) => (
                  <SelectItem key={table.id} value={table.id}>
                    {table.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label>{t("partyDate")} *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>{t("selectDate")}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">{t("time")} *</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              ⏱️ {t("durationFixed")}
            </p>
          </div>

          {/* Referee */}
          <div className="space-y-2">
            <Label htmlFor="refereeId">
              {t("referee")} ({t("optional")})
            </Label>
            <Select
              value={formData.refereeId || "none"}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  refereeId: value === "none" ? null : value,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("selectPlayer")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">-</SelectItem>
                {players.map((player) => (
                  <SelectItem key={player.id} value={player.id}>
                    {player.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Red Team */}
          <div className="space-y-2">
            <Label className="text-red-600 font-semibold">{t("redTeam")}</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="redDefenseId" className="text-xs">
                  {t("defense")}
                </Label>
                <Select
                  value={formData.redDefenseId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      redDefenseId: value === "none" ? null : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPlayer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="redAttackId" className="text-xs">
                  {t("attack")}
                </Label>
                <Select
                  value={formData.redAttackId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      redAttackId: value === "none" ? null : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPlayer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Blue Team */}
          <div className="space-y-2">
            <Label className="text-blue-600 font-semibold">
              {t("blueTeam")}
            </Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="blueDefenseId" className="text-xs">
                  {t("defense")}
                </Label>
                <Select
                  value={formData.blueDefenseId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      blueDefenseId: value === "none" ? null : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPlayer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="blueAttackId" className="text-xs">
                  {t("attack")}
                </Label>
                <Select
                  value={formData.blueAttackId || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      blueAttackId: value === "none" ? null : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectPlayer")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">-</SelectItem>
                    {players.map((player) => (
                      <SelectItem key={player.id} value={player.id}>
                        {player.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              {tCommon("cancel")}
            </Button>
            <Button type="submit" disabled={isLoading || !formData.babyfootId}>
              {isLoading
                ? tCommon("loading")
                : initialData
                ? t("editReservation")
                : t("addReservation")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
