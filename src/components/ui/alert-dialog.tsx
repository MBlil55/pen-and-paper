import React from 'react'

export interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export const AlertDialog: React.FC<AlertDialogProps> = ({ 
  open, 
  onOpenChange, 
  children 
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {children}
      </div>
    </div>
  );
}

export const AlertDialogContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="p-6">{children}</div>;
}

export const AlertDialogHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="space-y-2 mb-4">{children}</div>;
}

export const AlertDialogTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <h2 className="text-lg font-semibold">{children}</h2>;
}

export const AlertDialogDescription: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="text-sm text-gray-500">{children}</div>;
}

export const AlertDialogFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="flex justify-end space-x-2 mt-4">{children}</div>;
}

export const AlertDialogAction: React.FC<{
  onClick?: () => void
  children: React.ReactNode
}> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 
                 transition-colors"
    >
      {children}
    </button>
  );
}

export const AlertDialogCancel: React.FC<{
  onClick?: () => void
  children: React.ReactNode
}> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 
                 transition-colors"
    >
      {children}
    </button>
  );
}