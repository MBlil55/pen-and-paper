import React, { useState, useRef, useEffect } from "react";
import {
  GripVertical,
  X,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Settings,
} from "lucide-react";
import {
  CharacterInfoWidget,
  CharacterStatusWidget,
  SkillTreeWidget,
  DiceWidget,
  NotesWidget,
} from "./widgets";
import "./WidgetStyle.css";
import SettingsModal from "./SettingsModal";
import GearWidget from "./widgets/gearWidget/GearWidget";

// Typ-Definitionen
interface WidgetState {
  isMinimized: boolean;
  isClosing: boolean;
  isDragging: boolean;
  isResizing: boolean;
  previousSize?: { width: number; height: number };
  animationState: "idle" | "minimizing" | "maximizing" | "closing";
}

interface WidgetProps {
  widget: {
    i: string;
    type: string;
    title?: string;
    colorScheme?: string;
    isImportant?: boolean;
  };
  onRemove: () => void;
  className?: string;
}

type WidgetType =
  | "characterInfo"
  | "characterStatus"
  | "skillTree"
  | "dice"
  | "notes"
  | "gear";

const Widget: React.FC<WidgetProps> = ({
  widget,
  onRemove,
  className = "",
}) => {
  // State Management
  const [state, setState] = useState<WidgetState>({
    isMinimized: false,
    isClosing: false,
    isDragging: false,
    isResizing: false,
    animationState: "idle",
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);
  const previousSizeRef = useRef<{ width: number; height: number } | null>(
    null
  );

  // Type Guard für Widget-Typen
  const isWidgetType = (type: string): type is WidgetType => {
    return [
      "characterInfo",
      "characterStatus",
      "skillTree",
      "dice",
      "notes",
      "gear",
    ].includes(type);
  };

  // Event Handlers für Drag & Resize
  useEffect(() => {
    let dragTimeout: NodeJS.Timeout;
    let resizeTimeout: NodeJS.Timeout;

    const handleDragStart = () => {
      setState((prev) => ({ ...prev, isDragging: true }));
    };

    const handleDragEnd = () => {
      // Kleiner Timeout um flackern zu vermeiden
      dragTimeout = setTimeout(() => {
        setState((prev) => ({ ...prev, isDragging: false }));
      }, 50);
    };

    const handleResizeStart = () => {
      setState((prev) => ({ ...prev, isResizing: true }));
    };

    const handleResizeEnd = () => {
      // Kleiner Timeout um flackern zu vermeiden
      resizeTimeout = setTimeout(() => {
        setState((prev) => ({ ...prev, isResizing: false }));
      }, 50);
    };

    if (widgetRef.current) {
      // Mouse Events
      widgetRef.current.addEventListener("mousedown", (e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".widget-handle")) {
          handleDragStart();
        } else if (target.closest(".react-resizable-handle")) {
          handleResizeStart();
        }
      });

      // Touch Events
      widgetRef.current.addEventListener("touchstart", (e) => {
        const target = e.target as HTMLElement;
        if (target.closest(".widget-handle")) {
          handleDragStart();
        } else if (target.closest(".react-resizable-handle")) {
          handleResizeStart();
        }
      });

      // Global event listeners für End-Events
      document.addEventListener("mouseup", handleDragEnd);
      document.addEventListener("touchend", handleDragEnd);
      document.addEventListener("mouseleave", handleDragEnd);
      document.addEventListener("mouseup", handleResizeEnd);
      document.addEventListener("touchend", handleResizeEnd);
    }

    // Cleanup
    return () => {
      clearTimeout(dragTimeout);
      clearTimeout(resizeTimeout);
      document.removeEventListener("mouseup", handleDragEnd);
      document.removeEventListener("touchend", handleDragEnd);
      document.removeEventListener("mouseleave", handleDragEnd);
      document.removeEventListener("mouseup", handleResizeEnd);
      document.removeEventListener("touchend", handleResizeEnd);
    };
  }, []);

  // Toggle Minimize/Maximize
  const toggleMinimize = () => {
    if (widgetRef.current) {
      if (!state.isMinimized) {
        previousSizeRef.current = {
          width: widgetRef.current.offsetWidth,
          height: widgetRef.current.offsetHeight,
        };
      }

      setState((prev) => ({
        ...prev,
        isMinimized: !prev.isMinimized,
        animationState: prev.isMinimized ? "maximizing" : "minimizing",
      }));
    }
  };

  // Handle Close mit Bestätigungsdialog
  const handleClose = () => {
    if (widget.isImportant && !showConfirmDialog) {
      setShowConfirmDialog(true);
      return;
    }

    setState((prev) => ({
      ...prev,
      isClosing: true,
      animationState: "closing",
    }));
    setTimeout(() => {
      onRemove();
    }, 300);
  };

  // Bestätigungsdialog Komponente
  const ConfirmDialog = () => (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg max-w-sm mx-4">
        <div className="flex items-center gap-2 text-amber-500 mb-3">
          <AlertTriangle className="w-5 h-5" />
          <h3 className="font-medium">Widget schließen?</h3>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Möchten Sie dieses Widget wirklich schließen? Diese Aktion kann nicht
          rückgängig gemacht werden.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => setShowConfirmDialog(false)}
            className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
          >
            Abbrechen
          </button>
          <button
            onClick={() => {
              setShowConfirmDialog(false);
              handleClose();
            }}
            className="px-3 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );

  // Widget Content Renderer
  const renderContent = () => {
    if (!isWidgetType(widget.type)) {
      console.warn(`Unknown widget type: ${widget.type}`);
      return null;
    }

    if (state.isMinimized) {
      return (
        <div className="p-2 text-sm text-gray-500">
          {widget.title || widget.type}
        </div>
      );
    }

    switch (widget.type) {
      case "characterInfo":
        return <CharacterInfoWidget />;
      case "characterStatus":
        return <CharacterStatusWidget />;
      case "skillTree":
        return (
          <SkillTreeWidget
            title={widget.title || ""}
            colorScheme={widget.colorScheme || "gray"}
          />
        );
      case "dice":
        return <DiceWidget />;
      case "notes":
        return <NotesWidget />;
      case "gear":
        return <GearWidget />;
    }
  };

  // Dynamische Klassen Generator
  const getWidgetClasses = () => {
    return [
      "relative h-full flex flex-col bg-white shadow-sm rounded-lg transition-all duration-300",
      state.isDragging && "widget-dragging",
      state.isResizing && "widget-resizing",
      state.isClosing && "widget-closing",
      className,
    ]
      .filter(Boolean)
      .join(" ");
  };

  // Content Container Klassen
  const getContentClasses = () => {
    return [
      "flex-1 overflow-auto p-4",
      (state.isDragging || state.isResizing) && "select-none",
      state.isMinimized && "hidden",
    ]
      .filter(Boolean)
      .join(" ");
  };

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div
      ref={widgetRef}
      className={getWidgetClasses()}
      style={{
        userSelect: state.isDragging || state.isResizing ? "none" : "text",
        WebkitUserSelect:
          state.isDragging || state.isResizing ? "none" : "text",
        cursor: state.isDragging ? "grabbing" : "default",
      }}
    >
      {/* Header Section */}
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between rounded-t-lg select-none">
        <div className="widget-handle flex items-center space-x-2">
          <GripVertical className="w-4 h-4 text-gray-400" />
          <h3 className="font-bold text-gray-700">
            {widget.title || widget.type.replace(/([A-Z])/g, " $1").trim()}
          </h3>
        </div>

        <div className="flex items-center space-x-1">
          {/* Settings Button - Nur für bestimmte Widget-Typen oder immer anzeigen */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="widget-button p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title="Einstellungen"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            onClick={toggleMinimize}
            className="widget-button p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            title={state.isMinimized ? "Maximieren" : "Minimieren"}
          >
            {state.isMinimized ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={handleClose}
            className="widget-button p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
            title="Schließen"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Content Section */}
      <div className={getContentClasses()}>{renderContent()}</div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && <ConfirmDialog />}
    </div>
  );
};

export default Widget;
