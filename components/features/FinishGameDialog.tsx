"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface FinishGameDialogProps {
  reservationId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function FinishGameDialog({
  reservationId,
  isOpen,
  onClose,
  onSuccess,
}: FinishGameDialogProps) {
  const [redScore, setRedScore] = useState<string>("");
  const [blueScore, setBlueScore] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const redScoreNum = parseInt(redScore);
    const blueScoreNum = parseInt(blueScore);

    // Validation
    if (isNaN(redScoreNum) || isNaN(blueScoreNum)) {
      toast.error("Scores invalides", {
        description: "Veuillez entrer des scores valides",
      });
      return;
    }

    if (redScoreNum < 0 || blueScoreNum < 0) {
      toast.error("Scores invalides", {
        description: "Les scores ne peuvent pas être négatifs",
      });
      return;
    }

    if (redScoreNum > 10 || blueScoreNum > 10) {
      toast.error("Scores invalides", {
        description: "Les scores ne peuvent pas dépasser 10",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`/api/reservations/${reservationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "finish",
          finalScoreRed: redScoreNum,
          finalScoreBlue: blueScoreNum,
        }),
      });

      if (response.ok) {
        toast.success("Partie terminée !", {
          description: "Les scores ont été enregistrés",
        });
        onSuccess();
        onClose();
        // Reset form
        setRedScore("");
        setBlueScore("");
      } else {
        const data = await response.json();
        toast.error("Erreur", { description: data.error });
      }
    } catch {
      toast.error("Erreur réseau");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setRedScore("");
      setBlueScore("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-[#0D0D0D] border-[#00FFF7]/20">
        <DialogHeader>
          <DialogTitle className="font-subheading text-[#00FFF7]">
            Terminer la partie
          </DialogTitle>
          <DialogDescription className="text-[#B0B0B0]">
            Entrez les scores finaux pour terminer la partie
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Red Team Score */}
            <div className="space-y-2">
              <Label
                htmlFor="redScore"
                className="text-red-400 font-subheading"
              >
                Score Équipe Rouge
              </Label>
              <Input
                id="redScore"
                type="number"
                min="0"
                max="10"
                value={redScore}
                onChange={(e) => setRedScore(e.target.value)}
                placeholder="0"
                className="bg-[#0D0D0D]/50 border-red-400/30 focus:border-red-400 text-[#F2F2F2]"
                disabled={isLoading}
                required
              />
            </div>

            {/* Blue Team Score */}
            <div className="space-y-2">
              <Label
                htmlFor="blueScore"
                className="text-blue-400 font-subheading"
              >
                Score Équipe Bleue
              </Label>
              <Input
                id="blueScore"
                type="number"
                min="0"
                max="10"
                value={blueScore}
                onChange={(e) => setBlueScore(e.target.value)}
                placeholder="0"
                className="bg-[#0D0D0D]/50 border-blue-400/30 focus:border-blue-400 text-[#F2F2F2]"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="border-[#B0B0B0]/20 hover:bg-[#B0B0B0]/10"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#00FF6C] hover:bg-[#00FF6C]/80 text-black"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Terminer la partie
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
