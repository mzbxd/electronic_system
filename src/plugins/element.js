import Vue from 'vue'
import {
  Button, Form, FormItem, Input, Message,
  Container, Header, Aside, Main,
  Menu, Submenu, MenuItemGroup, MenuItem,
  Breadcrumb, BreadcrumbItem, Card, Row, Col,
  Table, TableColumn, Switch, Tooltip, Pagination,
  Dialog, MessageBox, Tag, Tree, Checkbox, CheckboxGroup,
  Select, Option, Cascader, Alert,
  Tabs, TabPane, Step, Upload
} from 'element-ui'

Vue.use(Button).use(Form).use(FormItem).use(Input)
  .use(Container).use(Header).use(Aside).use(Main)
  .use(Menu).use(Submenu).use(MenuItemGroup).use(MenuItem)
  .use(Breadcrumb).use(Card).use(Row).use(Col).use(BreadcrumbItem)
  .use(Table).use(TableColumn).use(Switch).use(Tooltip).use(Pagination)
  .use(Dialog).use(Tag).use(Tree).use(Checkbox).use(CheckboxGroup)
  .use(Select).use(Option).use(Cascader).use(Alert)
  .use(Tabs).use(TabPane).use(Step).use(Upload)

Vue.prototype.$message = Message
Vue.prototype.confirm = MessageBox.confirm
