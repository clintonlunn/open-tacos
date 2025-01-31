import { useState, useCallback } from 'react'
import FilterPopover from './ui/FilterPopover'
import YDSRangeSlider, { YDS_DEFS } from './ui/YDSRangeSlider'
import { actions, cragFiltersStore } from '../js/stores'

/**
 * Free climb grade range selector
 */
const YDSFilter = (): JSX.Element => {
  const initialRange = cragFiltersStore.get.freeRange()
  const [range, setRange] = useState(initialRange)

  const applyFn = useCallback((): void => {
    void actions.filters.updateFreeRange(range)
  }, [range]
  )

  const displayRange = cragFiltersStore.get.displayFreeRange()
  return (
    <FilterPopover
      label={`${displayRange[0]} - ${displayRange[1]}`}
      header='Select a grade range'
      min={YDS_DEFS[range[0]].label}
      max={YDS_DEFS[range[1]].label}
      onApply={applyFn}
    >
      <YDSRangeSlider onChange={setRange} defaultValue={initialRange} />
    </FilterPopover>
  )
}

export default YDSFilter
