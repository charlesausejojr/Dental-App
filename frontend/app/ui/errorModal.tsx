import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorMessage: string
}

export function ErrorModal({ isOpen, onClose, errorMessage }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>{errorMessage}</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}