import React, { useMemo, useState, useCallback } from 'react'

import BaseMap from './BaseMap'
import CragHighlightPopover from '../finder/CragHighlightPopover'
import { store, actions } from '../../js/stores'
import MarkerLayer from './MarkerLayer'
import InteractiveMarker
  from './InteractiveMarker'
import useAutoSizing from '../../js/hooks/finder/useMapAutoSizing'

/**
 * Make a map of crag markers.
 */
export default function CragsMap (): JSX.Element {
  const crags = store.filters.crags()

  const geojson = useMemo(
    () => store.filters.geojsonify()
    , [crags])

  const [viewstate, height, setViewState] = useAutoSizing({ geojson })

  const onViewStateChange = useCallback(({ viewState }) => {
    setViewState(viewState)
  }, [])

  // track current mouseover marker
  const [hoverMarker, setHoverMarker] = useState(null)

  const onHoverHandler = useCallback((event) => {
    const { features } = event
    const f = features[0]
    setHoverMarker([f.properties.lng, f.properties.lat])
  }, [])

  const onClickHandler = useCallback((event) => {
    const { features } = event
    const { id, lng, lat } = features[0].properties
    actions.filters.setActiveMarker(id, [lng, lat])
  }, [])

  const { areaId, lnglat } = store.filters.map().active

  return (
    <div
      id='my-area-map'
      className='w-full xl:sticky xl:top-[132px] xl:m-0 xl:p-0'
      style={{ height }}
    >
      <div className='absolute left-1 top-1 z-20'>
        {areaId !== null &&
          <CragHighlightPopover
            {...store.filters.areaById(areaId)}
          />}
      </div>
      <BaseMap
        initialViewState={viewstate}
        viewstate={viewstate}
        onViewStateChange={onViewStateChange}
        light={false}
        onClick={onClickHandler}
        onHover={onHoverHandler}
      >
        <MarkerLayer geojson={geojson} />
        <InteractiveMarker
          lnglat={hoverMarker}
        />
        <InteractiveMarker
          lnglat={lnglat}
          hover={false}
        />
      </BaseMap>
    </div>
  )
}
