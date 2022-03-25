import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { typesenseSearch } from '../../js/typesense/TypesenseClient'
import { Autocomplete } from './Autocomplete'
import { SearchByNameTemplate } from './ResultTemplates'
import { debounced } from '../../js/utils'

export const ClimbSearchByName = ({ isMobile = true, placeholder = 'Try \'Levitation 29\', \'technical crimpy\', or \'Lynn Hill\'' }: {isMobile?: boolean, placeholder?: string}): JSX.Element => {
  const router = useRouter()

  interface SourceItemsProps {
    grouped_hits: object[]
  }

  useEffect(() => {
    if (isMobile) return
    const inputs = document.getElementsByClassName('aa-Input')
    // for (let i = 0; i < inputs.length; i++) {
    //   (inputs[i] as HTMLElement).focus()
    // }
  })

  return (

    <Autocomplete
      placeholder={placeholder}
      classNames={{ item: 'name-search-item', panel: 'name-search-panel' }}
      getSources={ ({ query }) => {
        return debounced([
          {
            sourceId: 'climbs',
            getItems() {
              return typesenseSearch(query)
                .then(({grouped_hits}) => {
                  return grouped_hits
                })
                .catch(() => { return [] });
            },
            navigator: {
              async navigate ({ itemUrl }) {
                await router.push(itemUrl)
              }
            },
            getItemUrl ({ item }) {
              const { hits } = item
              /* eslint-disable-next-line */
              return hits.length > 0 ? `/climbs/${hits[0].document.climbId}` : ''
            },
            templates: {
              noResults () {
                return 'No results.'
              },
              item ({ item }) {
                return (
                  <SearchByNameTemplate router={router} groupKey={item.group_key[0]} hits={item.hits} />
                )
              }
            }
          }
        ])
        
      }}
    />
  )
}
