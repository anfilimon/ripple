import get from 'lodash.get'
import { getTermsFilter, getPagination, getIncludesByType } from '@dpc-sdp/ripple-tide-search-api/services/template-utils'
import { getFilterTodayConditions, capitalize } from './card-collection-utils'

export default {
  cards: {
    requestMapping: params => {
      let filters = []
      const sort = []

      if (params.filters) {
        filters = getTermsFilter(params)
      }

      if (params.site) {
        filters.push({
          term: {
            field_node_site: params.site
          }
        })
      }

      if (params.type && params.type !== 'all') {
        filters.push({
          term: {
            type: params.type
          }
        })
      }

      if (params.date_filter && params.date_filter.criteria !== 'all') {
        filters.push(...getFilterTodayConditions(params))
      }

      if (params.sort && Array.isArray(params.sort)) {
        sort.push(...params.sort)
      }

      if (params.promote) {
        sort.push({ sticky: 'desc' })
      }

      const query = {
        query: {
          bool: {
            filter: {
              bool: {
                must: filters
              }
            }
          }
        },
        sort,
        _source: getIncludesByType(params.type),
        ...getPagination(params)
      }

      return query
    },
    async responseMapping (res) {
      const hits = get(res, ['hits', 'hits'], [])
      if (hits && hits.length > 0) {
        return {
          total: res.hits.total,
          results: hits.map(hit => {
            const item = hit._source
            const result = {
              uuid: get(item, ['uuid', 0], ''),
              title: get(item, ['title', 0], ''),
              summary: get(item, ['field_landing_page_summary', 0], ''),
              image: get(item, ['field_media_image_absolute_path', 0], ''),
              link: {
                url: get(item, ['field_node_link', 0], get(item, ['url', 0], '')),
                text: ''
              }
            }

            if (item.type && item.type.length > 0) {
              switch (item.type[0]) {
                case 'event':
                  return {
                    ...result,
                    tag: capitalize(get(item, ['type', 0], '')),
                    date: {
                      from: get(item, ['field_event_date_start_value', 0], ''),
                      to: get(item, ['field_event_date_end_value', 0], '')
                    }
                  }
                case 'publication':
                  return {
                    ...result,
                    tag: capitalize(get(item, ['type', 0], '')),
                    date: {
                      from: get(item, ['field_event_date_start_value', 0], ''),
                      to: get(item, ['field_event_date_end_value', 0], '')
                    }
                  }
                case 'landing_page':
                  return {
                    ...result,
                    topic: get(item, ['field_topic_name', 0], '')
                  }
                case 'profile':
                case 'aboriginal_honour_roll':
                  return {
                    ...result,
                    tag: 'Profile',
                    variation: 'profile',
                    summary: get(item, ['field_profile_intro_text', 0], get(item, ['field_landing_page_summary', 0], '')),
                    date: get(item, ['field_year', 0], '')
                  }
                default:
                  return result
              }
            }
          })
        }
      } else if (res.hits) {
        return {
          total: res.hits.total,
          results: res.hits.hits
        }
      } else {
        return res
      }
    }
  }
}