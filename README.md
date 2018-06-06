
<br/>
<font color=#A52A2A size=3>注意: 变量均以$开始调用,example: $color</font>
<br/>
<br/>

<font color=#3194d0 size=3>本UI组件将思路从全局性，布局性，组件性(具体封装功能组件)，皮肤性，状态性，基于预编译stylus模式开发(需构建预编译环境)</font>
<br/>
<br/>

	Description:

      工具：

	    1、基于stylus预编译模块化css
	    2、基于node环境搭建构建工具（gulp,webpack）


	  实现:

        1、模块化样式组件（例如: button、color、layout等）
        2、模块化功能组件 (例如: alert、forms等)
        3、后期完善实现定制模式


      排期:

  	    1、前期完成独立模块化样式

            包含基本定义（colors, font, image）等基础通用模型
            包含组件模式 （buttons, alert,layouts, pages）等基础组件

        2、结合模块化样式组件完成功能组件（基础功能化组件）
        3、完善(实现定制化)

        构建工具以及相应文档
        UI文档编写（随时有调整变化）
        开发规则统一

## 目录

  <br/>

  <font color=#3572b0>附录</font>

  + <a href="https://codepen.io/anon/pen/mLqNxZ" target="_blank">色系文档</a>

  + <a href="http://stylus-lang.com/docs/" target="_blank">stylus文档</a>

  + <a href="https://www.gulpjs.com.cn/docs/api/" target="_blank">gulp文档</a>

  + <a href="###" target="_blank">UI Demo Template</a>

  + <a href="http://commonmark.cn/help/tutorial/05-links.html" target="_blank">API 支持 Markdown 语法</a>


  <br/>

  一、[UI模型](#chapter01)

  + UI
    1. 全局性(global)

        1-1. [站点色系](#chapter01-1)

        1-2. [站点字体字号](#chapter01-2)

        1-3. [站点状态](#chapter01-3)

    <br/>

    2. 布局性(layout继续中...)

        2-1. 常规布局(float,position,table...)

        2-2. flex布局

        2-3. grid布局

    <br/>

    3. 组件性(component)

       3-1. [buttons](#chapter02-1)

       3-2. [forms](#chapter02-2)

       3-3. [alerts](#chapter02-3)

       3-4. [pages](#chapter02-4)

       3-5. [scroll](#chapter02-5)

       3-6. [bubble](#chapter02-6)

       3-7. [toasts](#chapter02-7)

    <br/>

    4. [关于皮肤性，状态性](#chapter01-4)

       4-1. 皮肤性理解

       4-2. 状态性理解

       4-3. 本组件定义模式




  + Js Features

    待续....

  <br/>


  二、[UI结构(UI Structure)](#chapter02)

  + UI

    1. 全局性(global)


         参量定义

            variables   ->    全局变量

            mixins      ->    底层对应模块功能

         <br/>

         reset覆写定义

            normalize   ->    预设浏览器默认风格

            glyphicons  ->    字体库(bootstrap)

            default     ->    本UI需要覆写风格

          <br/>

     2. components组件

         [button(按钮)](#chapter02-1)

         [form(表单)](#chapter02-2)

         [alert(弹窗)](#chapter02-3)

         [pages(分页)](#chapter02-4)

         [scroll(滚动)](#chapter02-5)

         [bubble(气泡)](#chapter02-6)

         [toasts(快速弹出)](#chapter02-7)



  + Js Features

    待续....

  <br/>

  三、[命名规则(Name)](#chapter03)

  + UI

    1. [变量命名规则](#chapter03-1)

    2. [class命名规则](#chapter03-2)


<br/>

  + Js Features

    待续....

  <br/>

  四、[规范规则(Specification)](#chapter04)

  + [HTML规则](#chapter04-1)

  + [CSS规则](#chapter04-2)

  + [JS规则](#chapter04-3)

  <br/>

  五、[编译构建(Compiled)](#chapter05)

      待续...

<br/>
<br/>


### <span id="chapter01">一、UI模型</span>

___

<br/>

  #### <span id="chapter01-1">1、colors of global website</span>

  1. 站点色系：

     品牌: <font color=#CA0C16>#CA0C16</font>

  <br/>

  2. 站点基色：

     品牌: <font color=#CA0C16>#CA0C16</font>

     蓝色: <font color=#3399EA>#3399EA</font>

     橘色: <font color=#FFBB66>#FFBB66</font>

     绿色: <font color=#86CA5E>#86CA5E</font>

     灰色: <font color=#999999>#999999</font>

  <br/>

  3. 辅助基色：

     辅紫: <font color=#7C79E5>#7C79E5</font>

     辅粉: <font color=#E579B6>#E579B6</font>

  <br/>

  4. 色系定义

     <font color=3194d0>分为主色(baseColor)，辅助色(aidColor)，辅助基色系</font>

     (1) baseColor(red、blue、green、gray、orange)

         ${baseColor+base}
         example: $red-base

     <br/>

     (2) aidColor为基色变化模式分为light、dark
        深度范围deepLeve(1-9)

         $aid-light{deepLeve}-baseColor
         $aid-dark{deepLeve}-baseColor

         example: $aid-light1-red
                  $aid-dark1-red

     <br/>

     (3) 该色系为特殊色系(紫色purple、粉色pink)

         ${baseColor+base}

         example:$purple-base

     <br/>

     <font color=#A52A2A>源码来源文件：variables.styl</font>

<br/>

  #### <span id="chapter01-2">2、word related of global website</span>

  1. 字体:

      规则：先英文后中文

      首先苹果字体

          "SF Pro Display" (苹果 iOS/Mac 西文字体)

          Roboto, Noto (Android无衬线字体)

          Arial (Sans-Serif软件字体,window系统下支持西文)

          "PingFang SC" (苹果中文字体)

          "Hiragino Sans GB" (苹果冬青体中文体)

          "Microsoft YaHei" (Sans-Serif,window系统下中文黑体)

          sans-serif 系统默认

       <br/>

       <font color=#A52A2A>变量: $font-family-base</font>

   <br/>

   2. 字号:

       基本字号:14px

       基本小号字体:12px

       基本大号字体:18px

       <br/>

       <font color=#A52A2A>变量: $font-size-{base/small/large}</font>

   <br/>

   3. 其他:

       链接（默认链接(不提供标识)，常规链接,正文链接）

         <font color=#A52A2A>变量: $link-normal  (常规链接)</font>

         <font color=#A52A2A>变量: $text-link (正文链接)</font>

       <br/>

       正文(默认色系)

         <font color=#A52A2A>变量: $text-body-color</font>

       <br/>

       标题 h1->26号偶数递减至h6

         <font color=#A52A2A>变量:$font-size-{h1-h6}</font>

       <br/>

       <font color=#A52A2A>源码来源文件：variables.styl</font>

       <font color=#A52A2A>源码来源文件：default.styl</font>


<br/>

  #### <span id="chapter01-3">3、站点状态</span>

  <br/>

    1. disabled

      主要针对按钮，所以请组合 btn 运用(除了a标签)，若不组合，只会默认添加不可编辑色系

      运用方式:

      (1) class="disabled"

      (2) disabled 属性模式

      <button class = "btn disabled">class模式默认色系</button>

      <button class = "btn" disabled>属性默认色系</button>

      <button class = "btn btn-default" disabled>btn-default色系</button>

  <br/>

    2. hide or show

       针对display:none控制

       运用方式:

       <div class = "hide/show"></div>

  <br/>

    3. clearfix

       针对清除浮动

       运用方式:

       (1) .clearfix

       (2) .tag-test
             clearfix()  			// 已提供底层方法，推荐模式

       (3) .tag-test
             @extend .clearfix  	// 继承模式

  <br/>

     4. :link :visited :hover :focus :active

       针对a链接标签，button按钮

       (1) a标签 支持(hover, active)

       运动模式:

       默认不需要添加任何标注

       <a href="" class="hover">add class hover</a>

       <a href="" class="active">add class active</a>

       (2) button 标签目前支持 :hover / :focus / :active / .disabled / [disabled]

       运用模式:

       默认不需要添加任何标注

       <button class="btn hover">btn hover(hover必要性不大)</button>

       <button class="btn disabled">btn disabled</button>

  <br/>

     5. .active

       针对全局当前选项标注,包括所有组件下，后期保证组件下存在,组件会优先该组件下同名属性(统一规则，在做功能开发时，加强通用和可读性)

  <br/>


     待续中...



<br/>

  #### <span id="chapter01-4">4、关于皮肤性，状态性</span>

  <br/>

      4-1. 皮肤性理解

         皮肤性主要是指模式针对具体的风格表现展示，不针对布局定位，其目的是为了更好的分离结构之间的互相影响，起到解耦性分离，自成一种模式。

         皮肤展现特性：color, font-size, background 等...

         在布局时建议将该特性作为一个独立control来控制，灵活更换，灵活组合

  <br/>

      4-2. 状态性理解

         状态性主要是为了表现变化特性，分可以分为全局性状态性、组件性状态性，全局性更好的提先通用和公用性，组件状态是针对组件独立建立的一中模式控制

         通过两种模式，控制和独立话状态，由于该模式会结合到具体功能实现功能开发定义，该模式为了更好的控制，更好的脚本结合灵活运用

         全局性状态性：disabled, focus, blur 等...

         组件性状态：.alert-btn__disabled

  <br/>

      4-3. 本组件定义模式

         本组件模式将组件从

            (1) control(base structure(基本结构)
            (2) diversity structure(多样性结构))
            (3) mixins(structure(结构), skin(皮肤), status(状态))


            (1) control主控制与模板最相关的的定义，如果理解mvc模式，相当于c

                base structure(基本结构)改结构只定义初始化默认需要配备的要求定义

            (2) diversity structure(多样性结构)主要针对提供的皮肤组合模式，形成独立性皮肤控件



            (3) mixins主控制底层分解结构定义，目前我们从布局结构，皮肤变化，状态变化，三种出发定，后期可能添加具体功能逻辑函数定义

                structure(结构)以定义布局形态结构为主，例如尺寸，位置

                skin(皮肤)针对组合皮肤变化设置

                status(状态)针对组合状态变化设置

  <br/>

  <font color=#A52A2A>源码文件目录：mixins</font>

  关于命名模式介绍：[命名规则](#chapter03)


<br/>

### <span id="chapter02">二、UI结构</span>

___


  #### **components组件定义**

  <br/>

  ##### <span id="chapter02-1">1. buttons</span>

  <font color=#A52A2A>
        notice:该组件适用于可转换为任何按钮模式标签(除a标签不可点击)
  </font>

      主结构调用(控制主要结构展示，诠释为按钮模式)

          class = "btn"

      皮肤调用(控制主要色包展示，默认色包，自定义色包)

        目前提供色包组合:

          (1)、.btn-primary (主色调按钮)

               .btn-primary-default

               .btn-primary__disabled

          (2)、.btn-simple (简版按钮)

               .btn-simple-default

               .btn-simple__disabled

          (3)、.btn-default (默认版本)

               .btn-default__disabled

          (4)、功能性 (后期会添加...)

               .btn-confirm(确定性)
               .btn-alert(警示性)

  <br/>

  <font color=#A52A2A>源码来源文件：buttons.styl</font>

  <font color=#A52A2A>函数模块源文件：mixins/_buttons.styl</font>

  <br/><br/>


  ##### <span id="chapter02-2">2. form(此部分还在修改中....)</span>

  <font color=#A52A2A>
      notice:该组件目前只提供非适配模式，适配模式会后期加入
  </font>

      排版分类:

          1. 纵模式 (默认模式)

             class = "form"  目前可以不写

          2. 横模式

             class = "form-horizontal"


   <br/>

      基本元素结构模式均以组模式展示 (后面简称组)

          class = "form-group"

          label: .form-label

          input/select/textarea : .form-control

          example:

            <div class="form-group">
              <label for="name" class="form-label">
                一般
              </label>
              <input type="text" class="form-control" placeholder="一般" id="name">
            </div>


   <br/>

       状态模式

          组(form-group)添加展示标识:

             1. 成功 (.has-success)

             2. 错误 (.has-error)

          组包含:

             说明文字

             1. 常规介绍文字

                .help-block

                <div class="help-block">
                   说明文字
                </div>

             2. 验证提示信息文字

                .text-error (默认纵模式)

                .text-horizontal-error (横p模式)

                <div class="text-error">
                   错误信息
                </div>

  <br/>

  <font color=#A52A2A>源码来源文件：forms.styl</font>

  <font color=#A52A2A>函数模块源文件：mixins/_forms.styl</font>

  <br/><br/>

  ##### <span id="chapter02-3">3. alert(弹窗)</span>

    主结构调用(控制主要结构展示，标志为alert)

        class = "alert"

  <br/>

    基础结构(本结构不做强制要求，无特殊情况，按基础结构布局)

        <div class="alert">
          <!--导入按钮提供模式-->
          <button class = "btn btn-default alert-close">&times</button>
          <div class = "alert-content">
            <!--导入标题-->
            <h6 class = "alert-title">simple title tag</h6>
            <!--导入信息内容-->
            <div class = "alert-info">
              个人自定义任何标签
            </div>
            <!--按钮组导入-->
            <div class="alert-btns"></div>
          </div>
        </div>

        已提供按钮组排列模式: (alert-btns-left/alert-btns-center/alert-btns-right)

  <br/>

    基础皮肤

        class = "alert-default"

        源码来源文件：alerts.styl, 函数来源于mixins/_alerts.styl

        .alert-default
          alert-size(400px, 200px) // 设置尺寸
          alert-position()  // 设置展示位置默认居中fixed模式
          box-shadow(0, 0, 4px, 0, $aid-light4-gray)  // 设置阴影
          alert-variant()  // 目前只提供背景皮肤

  <br/>

  <font color=#A52A2A>源码来源文件：alerts.styl</font>

  <font color=#A52A2A>函数模块源文件：mixins/_alerts.styl</font>

  <br/>

  ##### <span id="chapter02-4">4. page(分页)</span>

    主结构调用(控制主要结构展示，标志为分页)

        class = "page-group"

 <br/>

    基础结构(本结构要求ul标签模式)

      <ul class = "page-group">
         <!--总页-->
         <li class="page-total">总页</li>
         <!--上一页-->
         <li class="page-prev"><a href="" class="">上一页</a></li>
         <!--页码模块-->
         <li class="page-number">
              <a href="">page number 1</a>
              <a href="" class="active">page number 2</a>
              <span>...</span>
              <a href="">page number 3</a>
         </li>
         <!--下一页-->
         <li class="page-next"><a href="">下一页</a></li>
         <!--导入跳转页码模块-->
         <li class="page-go">
              <input type="text">
              <a href="###">跳转</a>
         </li>
      </ul>

      注释部分可根据情况自行组合

  <br/>

    提供模式

      1、默认模式(结构以上为标准)

      2、简单模式

        class = "page-simple" 添加

        <!--页码模块-->
         <li class="page-number">
              <a href="">page number 1</a>
              <span>/</span>
              <a href="">page number 3</a>
         </li>

  <br/>

  <font color=#A52A2A>源码来源文件：pages.styl</font>

  <font color=#A52A2A>函数模块源文件：mixins/_pages.styl</font>

  <br/><br/>

  ##### <span id="chapter02-5">5. scroll(滚动)</span>

  <font color=#A52A2A>
      notice: 该组件不设置宽度，由主结构父级定义尺寸
  </font>

    主结构调用(控制主要结构展示，标志为滚动)

        class = "scroll"

  <br/>

    基础结构(本结构要求ul标签模式)

      <!--主结构-->
      <div class = "scroll">
        <!--滚动内容结构-->
        <div class = "scroll-content">
           这里是滚动的内容哦！！！
        </div>
        <!--滚动条组-->
        <div class = "scroll-group">
           <!--滚动bar-->
           <div class="scroll-bar"></div>
           <!--滚动背景条-->
           <div class="scroll-line"></div>
        </div>
      </div>

      注释滚动内容结构为可自定义结构，也可直接运用改模块格式，内部做自定义

  <br/>

    提供模式

       1、默认滚动组

          bar: .scroll-bar(平方模式)
          line: .scroll-line

       2、圆角模式

          bar: .scroll-bar__circle(平方模式)
          line: .scroll-line


  <font color=#A52A2A>后续会添加其他皮肤模式...</font>

  <br/>

  <font color=#A52A2A>源码来源文件：scroll.styl</font>

  <font color=#A52A2A>函数模块源文件：mixins/_scroll.styl</font>

  <br/><br/>

  ##### <span id="chapter02-6">6. bubble</span>

    主结构调用(控制主要结构展示，标志为bubble气泡)

      <div class = "bubble"></div>

      默认为非箭头模式

  <br/>

    基础结构

       <div class = "bubble">
          <span>内容</span>
       </div>

  <br/>

    提供模式(主模式上添加)

      方向模式

        1、.bubble-arrow-top

           箭头向上

        2、.bubble-arrow-bottom

           箭头向下

        3、.bubble-arrow-left

           箭头向左

        4、.bubble-arrow-right

           箭头向右

      链接模式

         结构：

            <div class="bubble">
              <a href="">方式一</a>
            </div>

            <a href="" class="bubble">
               <span>方式二</span>
            </a>

  <br/>

  <font color=#A52A2A>源码来源文件：bubble.styl</font>

  <font color=#A52A2A>函数模块源文件：mixins/_bubble.styl</font>

  <br/><br/>

  ##### <span id="chapter02-7">7. toasts(面包弹出)</span>

   <font color=#A52A2A>
      notice: 该组件最大宽度200px，链接色为白色，如果需自定义，请覆写
   </font>

    主结构调用(控制主要结构展示，标志为toasts面包弹出)

       <div class = "toasts"></div>

   <br/>

    基础结构

       <div class = "toasts">
          <span>内容</span>
       </div>

   <br/>

    提供模式

      1、常规模式

         <div class = "toasts">
           <span>内容</span>
         </div>

      2、链接模式

         <div class="toasts">
            <a href="">最多允许十五字，方便快速阅读。</a>
         </div>

         <a href="" class="toasts">
            <span>最多允许十五字，方便快速阅读。</span>
         </a>

      3、图标模式

         <div class="toasts">
            <i class="glyphicon glyphicon-heart toasts-icon"></i>
            <span>内容</span>
         </div>

         字体库class

         .glyphicon .glyphicon-heart

         toasts提供

         .toasts-icon

  <br/>

  <font color=#A52A2A>源码来源文件：toasts.styl</font>

  <font color=#A52A2A>函数模块源文件：mixins/_toasts.styl</font>

  <br/><br/>


  ### <span id="chapter03">三、命名规则(UI Name)</span>

___

<br/>

  #### <span id="chapter03-1">1、变量命名规则</span>

    命名组合

      从以下模式上考虑

      (1) 类型 (red, body, text, link, primary...)
      (2) 模式 (default, normal, base, primary...)
      (3) 属性/特性 (color, background, h1...)

      组合后具体意义强调具有关联关系，不过分具体到某一个，而是某种状态功能下，大的模块理解，组合连接模式均以(-)连接

      example:

       $red-base, $text-body-color, $font-size-base, $brand-primary 等

<br/>

  #### <span id="chapter03-2">2、class名规则</span>

     命名方向

        (1) 全局方向

        (2) 组件方向



        (1) 全局方向主要考虑为状态模式定义，disabled, open, focus(注意此部分，都具有全局和通用性)

            比如我们可以在需要添加不可能点击标签上添加class为disabled

            class名具有简洁，通用，不需要提供(-)连接模式，这里不体现到某一个模式或者功能分类上

        (2) 组件方向

            针对组件类型(功能)-模式、形态__状态，连接方式状态以双下划线关联，根据定义情况，添加是否关联

            .bubble / .bubble-arrow-top 无状态

            .btn / .btn-primary__disabled 有状态

     命名规则简洁，易懂也会决定开发的速度后期维护成本，以及通用性，复用性

















