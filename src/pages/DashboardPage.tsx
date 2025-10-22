import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { DashboardCard } from "../components/DashboardCard";
import { WorkOrderStatusChart } from "../components/WorkOrderStatusChart";
import { VendorResponsivenessChart } from "../components/VendorResponsivenessChart";
import { CostSavingsChart } from "../components/CostSavingsChart";

const STORAGE_KEY = "dashboard-widgets";

interface Widget {
  id: string;
  title: string;
  component: React.ComponentType;
  isPinned: boolean;
}

const defaultWidgets: Widget[] = [
  {
    id: "work-orders",
    title: "Work Order Status",
    component: WorkOrderStatusChart,
    isPinned: false
  },
  {
    id: "vendor-response",
    title: "Vendor Responsiveness",
    component: VendorResponsivenessChart,
    isPinned: false
  },
  {
    id: "cost-savings",
    title: "Cost Savings",
    component: CostSavingsChart,
    isPinned: false
  }
];

export const DashboardPage: React.FC = () => {
  const [widgets, setWidgets] = useState<Widget[]>(defaultWidgets);

  // Load saved widget state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const savedWidgets = JSON.parse(saved);
        // Merge saved state with default widgets to handle new widgets
        const mergedWidgets = defaultWidgets.map(defaultWidget => {
          const savedWidget = savedWidgets.find((w: any) => w.id === defaultWidget.id);
          return savedWidget ? { ...defaultWidget, ...savedWidget } : defaultWidget;
        });
        setWidgets(mergedWidgets);
      } catch (error) {
        console.error("Error loading dashboard state:", error);
      }
    }
  }, []);

  // Save widget state to localStorage
  const saveWidgets = (newWidgets: Widget[]) => {
    const widgetsToSave = newWidgets.map(({ component, ...widget }) => widget);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(widgetsToSave));
  };

  // Handle pinning/unpinning widgets
  const handlePin = (widgetId: string) => {
    const newWidgets = widgets.map(widget => {
      if (widget.id === widgetId) {
        return { ...widget, isPinned: !widget.isPinned };
      }
      return widget;
    });

    // Sort widgets: pinned first, then by original order
    const sortedWidgets = [...newWidgets].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });

    setWidgets(sortedWidgets);
    saveWidgets(sortedWidgets);
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
    saveWidgets(items);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            CFS Facilities Dashboard
          </h1>
          <p className="text-sm text-gray-600">
            Monitor your facility operations and key performance indicators
          </p>
        </div>

        {/* Dashboard Grid */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="dashboard">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {widgets.map((widget, index) => {
                  const Component = widget.component;
                  return (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`${
                            snapshot.isDragging ? 'rotate-3 scale-105' : ''
                          } transition-transform duration-200`}
                        >
                          <DashboardCard
                            title={widget.title}
                            onPin={() => handlePin(widget.id)}
                            isPinned={widget.isPinned}
                          >
                            <Component />
                          </DashboardCard>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Drag widgets to reorder • Click the star to pin important widgets to the top
          </p>
        </div>
      </div>
    </div>
  );
};