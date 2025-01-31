import { useRouter } from 'next/router'
import NProgress from 'nprogress/nprogress'

import CragsMap from '../maps/CragsMap'
import useCragFinder from '../../js/hooks/finder/useCragFinder'
import CragTable from './CragTable'
import TwoColumnLayout from './TwoColumnLayout'
import Pagination from './Pagination'
import DownloadLink from './Download'

NProgress.configure({ showSpinner: false, easing: 'ease-in-out', speed: 1000 })

const DataContainer = (): JSX.Element => {
  const cragFiltersStore = useCragFinder(useRouter())
  const { total, searchText, isLoading } = cragFiltersStore.useStore()

  if (isLoading) {
    NProgress.start()
  } else {
    NProgress.done()
  }

  return (
    <TwoColumnLayout
      left={
        <>
          <Preface isLoading={isLoading} total={total} searchText={searchText} />
          <CragTable />
          <Pagination />
        </>
}
      right={<CragsMap />}
    />
  )
}

export default DataContainer

const Preface = ({ isLoading, total, searchText }: {isLoading: boolean, total: number, searchText: string}): JSX.Element => {
  return (
    <section className='mt-36 px-2 py-3 text-sm border border-b-2 border-slate-600 rounded-md flex items-center justify-between'>
      <div>
        <div>
          {isLoading
            ? `Loading crags in ${searchText}...`
            : `${humanizeNumber(total)} crags near ${searchText}`}
        </div>
        <div>Consult local climbing community and guidebooks before you visit.</div>
      </div>
      <DownloadLink />
    </section>
  )
}
const humanizeNumber = (n: number): string => n > 300 ? '300+' : n.toString()
