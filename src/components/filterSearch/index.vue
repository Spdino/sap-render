<template>
  <div>
    <el-form class="query-module" size="mini" label-position="top">
      <el-row :gutter="36">
        <el-col :span="18">
          <el-row :gutter="36">
            <el-col :span="8" v-for="item in row" :key="item.name">
              <el-form-item :label="item.label">
                <template v-if="item.type === 'text'">
                  <search-input v-model="textForm[item.name]" @getData="getData" :name="item.name"></search-input>
                </template>
                <template v-else-if="item.type === 'date'">
                  <div class="date-wrap">
                    <el-date-picker v-model="dateForm[item.name +'-'+ 'dateB']" value-format="yyyy-MM-dd" placeholder="开始日期" type="date">
                    </el-date-picker>
                    <p class="division">-</p>
                    <el-date-picker v-model="dateForm[item.name +'-'+ 'dateE']" value-format="yyyy-MM-dd" placeholder="结束日期" type="date">
                    </el-date-picker>
                  </div>
                </template>
                <template v-else>
                  <el-select v-model="selectFrom[item.name]" multiple placeholder="请选择">
                    <el-option v-for="el in item.options" :key="el.value" :label="el.label" :value="el.value">
                    </el-option>
                  </el-select>
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-collapse-transition>
            <div v-show="dividerType">
              <el-row :gutter="36">
                <el-col :span="8" v-for="item in hideRow" :key="item.label">
                  <el-form-item :label="item.label">
                    <template v-if="item.type === 'text'">
                      <search-input v-model="textForm[item.name]" @getData="getData" :name="item.name"></search-input>
                    </template>
                    <template v-else-if="item.type === 'date'">
                      <div class="date-wrap">
                        <el-date-picker v-model="formateDate[item.name + 'dateB']" value-format="yyyy-MM-dd" @change="changeDate($event,item.name,'start')" placeholder="开始日期" type="date">
                        </el-date-picker>
                        <p class="division">-</p>
                        <el-date-picker v-model="formateDate[item.name + 'dateE']" value-format="yyyy-MM-dd" @change="changeDate($event,item.name,'end')" placeholder="结束日期" type="date">
                        </el-date-picker>
                      </div>
                    </template>
                    <template v-else>
                      <el-select v-model="selectFrom[item.name]" multiple placeholder="请选择">
                        <el-option v-for="el in item.options" :key="el.value" :label="el.label" :value="el.value">
                        </el-option>
                      </el-select>
                    </template>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-collapse-transition>
        </el-col>
        <el-col :span="4">
          <el-form-item label=" ">
            <el-button type="primary" @click="query">查询</el-button>
            <el-button>高级搜索</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <divider @dividerChange="dividerType = !dividerType" :dividerType="dividerType"></divider>
    </el-form>
  </div>
</template>
<script>
import divider from 'components/Divider'
import searchInput from './rangeDialog'

export default {
  name: 'filterSearch',
  components: {
    divider,
    searchInput
  },
  props: {
    Fields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dividerType: false,
      textForm: {},
      selectFrom: {},
      dateForm: {},
      formateDate: {},
      row: [],
      hideRow: [],
      Form: {},
      dateNameArr: []
    }
  },
  mounted() {
    if (this.Fields) {
      this.initData()
    }
  },
  methods: {
    initData() {
      this.row = this.Fields.slice(0, 3)
      this.hideRow = this.Fields.slice(3)
    },
    changeDate(val, name, type) {
      if (!this.dateForm[name]) {
        this.dateForm[name] = []
      }
      if (type === 'start') {
        this.dateForm[name][0] = val
      } else {
        if (this.dateForm[name][0]) {
          const time1 = Date.parse(new Date(this.dateForm[name][0]))
          const time2 = Date.parse(new Date(val))
          if (time2 && Number(time2) - Number(time1) < 0) {
            this.$message.error('结束日期不能小于开始日期')
            this.formateDate[name + 'dateE'] = null
            return
          }
        }
        this.dateForm[name][1] = val
      }
    },
    getData(data, name) {
      this.Form[name] = data
    },
    formateData(data, type) {
      if (this.selectFrom && type === 'select') {
        const arr = []
        for (const key in data) {
          if (data[key]) {
            for (let i = 0; i < data[key].length; i++) {
              const el = data[key][i]
              const obj = {
                name: key,
                sign: 'I',
                option: 'EQ',
                low: el,
                high: ''
              }
              arr.push(obj)
            }
          }
        }
        return arr
      } else {
        if (this.dateForm && type === 'date') {
          const arr = []
          for (const key in this.dateForm) {
            const item = this.dateForm[key]
            if (item.length) {
              let obj = {}
              if (item[0] && !item[1]) {
                obj = {
                  name: key,
                  sign: 'I',
                  option: 'GE',
                  low: item[0],
                  high: ''
                }
              } else if (!item[0] && item[1]) {
                obj = {
                  name: key,
                  sign: 'I',
                  option: 'LE',
                  low: item[1],
                  high: ''
                }
              } else if (item[0] && item[1]) {
                obj = {
                  name: key,
                  sign: 'I',
                  option: 'BT',
                  low: item[0],
                  high: item[1]
                }
              }
              arr.push(obj)
            }
          }
          return arr
        }
      }
    },
    query() {
      let arrData = []
      const selectArr = this.formateData(this.selectFrom, 'select')
      const dateArr = this.formateData(this.dateForm, 'date')
      if (this.Form) {
        for (const key in this.Form) {
          const item = this.Form[key]
          arrData = [...arrData, ...item]
        }
      }
      arrData = [...arrData, ...selectArr, ...dateArr]
      this.$emit('query', [...new Set(arrData)])
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/styles/variables.scss";

.query-module {
  margin: 10px;
  padding: 17px 22px 0;
  height: 100%;
  background: $moduleBg;
}
.el-form-item {
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
}
.date-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  .division {
    margin: 0 10px;
  }
}
</style>
<style lang="scss">
.query-module .el-date-editor.el-input__inner {
  width: 100%;
}
</style>


