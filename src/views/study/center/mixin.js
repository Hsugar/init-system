//  公共资源
import _ from 'lodash'
import thumbnail from '@/components/thumbnail/index'
import { typeList, tabList, switchListItem, moveListItem } from '@/service/study'
import { customerList } from './customerList'
export const computed = {
  // 客户类型列表
  customerList () {
    return customerList.map(item => {
      let { key, value } = item
      return {
        name: value,
        value: key
      }
    })
  }
}

export const filters = {
  thumb (src) {
    return `background-image: url(${src})`
  }
}

export const components = {
  thumbnail: thumbnail
}

export const methods = {
  // 获取文档列表
  _getTypes: async function (query) {
    let result = await typeList({ pageNum: 20 }, this.$data.key)
    let { list = [] } = result
    return [].concat([], list)
  },
  _getList: async function (query = {}) {
    let param = _.assign({
      page: this.$data.page
    }, this.$data.query, query)
    let result = await tabList(param, this.$data.key)
    let { header = [], list = [], totalPage = 0 } = result
    if (totalPage < 1) {
      totalPage = 1
    }
    return {
      page: param.page,
      header,
      list,
      totalPage
    }
  },
  currentChange (value) {
    this.getList({
      page: value
    })
  },
  // 复制
  onCopy (url = '') {
    this.$copyText(url).then((e) => {
      this.$message({
        message: '复制成功',
        type: 'success',
        center: true
      })
    }, (e) => {
      this.$message({
        message: '复制失败,请重试~',
        type: 'warning',
        center: true
      })
    })
  },
  // 下架&上架
  onSwitchItem: async function (row, index, status) {
    try {
      let param = {
        listType: this.$data.key,
        id: row.id,
        status: status
      }
      await switchListItem(param)
      let list = [].concat(this.list)
      list[index].is_delete = status

      _.assign(this.$data, {
        list: list
      })
    } catch (e) {
      this.$message.error(e.msg)
    }
    this.getList()
  },
  // 上移&下移
  onMoveItem: async function (row, index, type) {
    let nextIndex = index
    let prevIndex = index

    if (type === 'up') {
      if (this.page === 1 && index < 1) {
        return false
      }
      prevIndex = index - 1
    } else {
      if (this.page === this.totalPage && index == this.list.length - 1) {
        return false
      }
      nextIndex = index + 1
    }
    try {
      let param = {
        listType: this.$data.key,
        prevId: this.list[prevIndex].id,
        nextId: this.list[nextIndex].id,
        prevSort: this.list[nextIndex].sort,
        nextSort: this.list[prevIndex].sort
      }
      await moveListItem(param)
      this.getList()
    } catch (e) {
      this.$message.error(e.msg)
    }
  },
  // 删除
  onDel: async function (id) {
    try {
      let param = {
        listType: this.$data.key,
        id: id,
        status: 2
      }
      await switchListItem(param)
      this.deleVisible = false
      this.getList()
    } catch (e) {
      this.$message.error(e.msg)
    }
  }
}
