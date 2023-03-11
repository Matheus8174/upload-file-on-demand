import './scss/styles.scss'

import View from './view'
import Controller from './controller'
import Repository from './repository'
import Service from './service'

const controller = new Controller(
  new View(),
  new Repository(),
  new Service()
)

controller.execute()
