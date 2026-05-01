
<div class="container mt-3">
	<h2>手风琴实例</h2>
   <p><strong>注意：</strong> 使用 <strong>data-parent</strong> 属性来确保所有的折叠元素在指定的父元素下，这样就能实现在一个折叠选项显示时其他选项就隐藏。</p>
 
    <div id="accordion">
        <div class="card">
            <div class="card-header">
                <a class="btn" data-bs-toggle="collapse" href="#collapseOne">
                选项一
                </a>
            </div>
            <div id="collapseOne" class="collapse show" data-bs-parent="#accordion">
                <div class="card-body">
                #1 内容：菜鸟教程 -- 学的不仅是技术，更是梦想！！！
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <a class="collapsed btn" data-bs-toggle="collapse" href="#collapseTwo">
                选项二
            </a>
            </div>
             <div id="collapseTwo" class="collapse" data-bs-parent="#accordion">
                <div class="card-body">
                #2 内容：菜鸟教程 -- 学的不仅是技术，更是梦想！！！
                </div>
            </div>
        </div>
        <div class="card">
            <div class="card-header">
                <a class="collapsed btn" data-bs-toggle="collapse" href="#collapseThree">
                选项三
                </a>
            </div>
            <div id="collapseThree" class="collapse" data-bs-parent="#accordion">
                <div class="card-body">
                #3 内容：菜鸟教程 -- 学的不仅是技术，更是梦想！！！
                </div>
            </div>
        </div>
    </div>
</div>