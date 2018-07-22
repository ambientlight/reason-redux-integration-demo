import styled from 'styled-components'
import { withTheme } from '@material-ui/core/styles'

import { safe, StyledThemedProps } from '../../utils'
const ResourceList = require('reason/components/ResourceList/ResourceList.bs').connectedComponent
const Classes = require('reason/components/ResourceList/ResourceList.bs').classNames
import { ResourceListWidth } from '../constants'

const StyledResourceList = styled(ResourceList)`
  display: flex;
  flex-direction: column;

  width: ${ResourceListWidth}px;
  background-color: ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.grey[900], '#2a2a2a')};
  border-right: 1px solid ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.grey[800], 'lightgray')};

  .${Classes.header} {
    padding: 16px;
  }   

  .${Classes.placeholder} {
    padding: 8px 16px;
    opacity: 0.65;
  }

  .${Classes.element} {
    padding: 4px 8px 4px 24px;
    display: flex;
    align-items: center;

    svg {
      color: white;
      width: 16px;
      height: 16px;
    }

    .${Classes.elementName} {
      padding-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .${Classes.removeButton} {
      display: none;
      width: 16px;
      height: 16px;

      &:hover svg {
        color: ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.secondary.main, '#ffa500')};
      }
    }

    &.selected {
      background-color: ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.grey[800], '#2a2a2a')};
    }
    
    &:hover {
      background-color: ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.grey[800], '#2a2a2a')};
      
      .${Classes.removeButton} {
        display: initial;
      }
    }

    &:hover:not(.selected) {
      cursor: pointer;
    }
  }

  .${Classes.addVideoButton} {
    margin-top: 16px;
    color: ${(props: StyledThemedProps) => safe(props.theme)(theme => theme.palette.secondary.main, '#ffa500')};
  }
`
export default withTheme()(StyledResourceList as any)