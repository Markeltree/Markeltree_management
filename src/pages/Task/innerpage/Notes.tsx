import React, { useState } from 'react'
import HeadingTwo from '../component/HeadingTwo'
import SearchInput from '../component/SearchInput'
import Export from '../component/Export'
import { IoFilterOutline } from 'react-icons/io5'
import FilterModal from '../component/FilterModal'

const Notes = () => {
      const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
       const handleApplyFilters = (filters) => {
    setAppliedFilters(filters);
    console.log("Applied filters:", filters);
  };

  const [appliedFilters, setAppliedFilters] = useState({
    status: [],
    priority: [],
    assignee: [],
  });
    
  return (
    <>
    <div className="flex flex-col gap-4 bg-white dark:bg-[#0D0D0D] rounded-lg">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <HeadingTwo text="My Notes" className="text-[#333333]" />
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <SearchInput />
            <Export
                BtnName="Filters"
                icon={IoFilterOutline}
                onClick={() => setIsFilterModalOpen(true)}
              />
          </div>
        </div>
        <div>
        </div>
      </div>
      <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          onApplyFilters={handleApplyFilters}
        />
    </>
  )
}

export default Notes