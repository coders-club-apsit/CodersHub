import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function NotificationToggle({ 
  enabled, 
  onEnabledChange, 
  notificationMessage, 
  onMessageChange,
  defaultMessage,
  className 
}) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">Broadcast Notification</Label>
          <p className="text-sm text-muted-foreground">
            Notify all users when this content is published
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={onEnabledChange}
          className="data-[state=checked]:bg-primary"
        />
      </div>
      
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Input
              placeholder={defaultMessage}
              value={notificationMessage}
              onChange={(e) => onMessageChange(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground mt-2">
              This message will be shown in the notification. Keep it short and informative.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}