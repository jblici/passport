import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {Button} from './button'
import { ChevronRight, ChevronDown } from 'lucide-react'
import InputModal from './inputModal'


const dropdownVariants = {
  desktop: {
    open: { width: 'auto', opacity: 1, x: 0 },
    closed: { width: 0, opacity: 0, x: -20 },
  },
  mobile: {
    open: { height: 'auto', opacity: 1, y: 0 },
    closed: { height: 0, opacity: 0, y: -20 },
  }
}

export default function AnimatedDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleDropdown = () => setIsOpen(!isOpen)
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);
  const [discount, setDiscount] = useState('');
  const handleDiscountSubmit = (discountValue) => {
    setDiscount(discountValue);
    console.log('Discount:', discountValue);
  };

  return (
    <div className="relative">  
     <InputModal
        isOpen={isDiscountModalOpen}
        onClose={() => isDiscountModalOpen(false)}
        onSubmit={handleDiscountSubmit}
        title="Enter Client's Name"
        placeholder="Client's Name"
      />
      <Button 
        onClick={toggleDropdown} 
        variant="default" 
        className="flex items-center gap-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Agregar
        <ChevronRight className="h-4 w-4 transition-transform duration-200 rotate-90 md:rotate-0 md:block hidden" />
        <ChevronDown className="h-4 w-4 transition-transform duration-200 md:hidden" />
      </Button>
      <AnimatePresence>
        {isOpen && (
          <React.Fragment>
            {/* Desktop version - animates to the right */}
            <motion.div
              variants={dropdownVariants.desktop}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ duration: 0.3 }}
              className="absolute left-full top-0 ml-2 hidden md:flex overflow-hidden whitespace-nowrap"
            >
              <div className="flex">
              <Button variant="defualt" button onClick={() => setIsDiscountModalOpen(true)}>Descuento Alojamiento</Button>
                
                <Button variant="default">Ingresar Item</Button>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  )
}