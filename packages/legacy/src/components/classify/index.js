import Vue from 'vue'

import PageContainer from './PageContainer'
import PageHeader from './PageHeader'
import Button from './Button'
import Upload from './Upload'
import Cascader from './Cascader'

const common = [
  PageContainer,
  PageHeader,

  Button,
  Upload,
  Cascader,
]

common.forEach(component => Vue.component(component.name, component))
