<script lang="ts">
  import { onMount } from "svelte";
  onMount(async () => {
    const bootstrap = await import("bootstrap");
    const dataSpyList = document.querySelectorAll('[data-bs-spy="scroll"]');
    dataSpyList.forEach((dataSpyEl) => {
        // bootstrap.ScrollSpy.getOrCreateInstance(dataSpyEl);
      const instance = bootstrap.ScrollSpy.getOrCreateInstance(dataSpyEl);
      console.log('----> scrollspy init');
      if (instance) {
        console.log('----> scrollspy refresh');
        instance.refresh();
      }
    });
  });

  let note: string = `把控制权交给 data-bs-spy 所在的 div  ，正常了为什么
  这涉及到 ScrollSpy 的底层工作原理。之所以“把控制权交给它”就正常了，是因为你满足了 Bootstrap 插件运行的 3个物理条件：
## 1. 滚动条的“归属权”对齐了

* 之前： 滚动条产生在 col-8 上，但你的 data-bs-spy 监听器写在内部的 div 上。内部 div 实际上是被长文本撑开了几千像素，它本身并没有在“滚动”，只是在被外层的 col-8 移动。所以监听器感知不到任何位移。
* 现在： 你给 data-bs-spy 的 div 加上了 h-100 和 overflow-y-auto。现在产生滚动条的容器和监听器所在的容器是同一个。它能立刻捕捉到 onscroll 事件。

## 2. 坐标计算的“基准点”对了

* 之前： ScrollSpy 会计算 <h4> 距离“父容器顶端”的距离。因为内部 div 高度是 auto（也就是跟内容一样长），在它的坐标系里，Item 1 的位置永远是 0，Item 2 永远是 500... 无论你怎么滚，它相对于自己这个 div 的位置都没变。
* 现在： 容器有了固定高度和 position: relative。当它滚动时，内部元素相对于这个有限视口顶部的距离会发生实时变化。ScrollSpy 终于能算出来：“哦，Item 2 现在到顶了，该亮它了”。

## 3. 内容与容器的“约束”

* 左侧菜单为什么显得高度占得多？ 是因为之前右侧容器没有 h-100，它其实是在“被动”地被外层限制。
* 现在： 左右两个 col 里的直接子元素都通过 h-100 强行锁死在了父级 row 的 25% 高度内。这样无论内容多少，它们在视觉上永远是等高的。

------------------------------
## 总结
Bootstrap ScrollSpy 的“金科玉律”：

谁有滚动条（overflow），就把 data-bs-spy 写在谁身上；并且这个元素必须有明确的高度（h-100/px/vh）和定位（relative）。

既然现在滚动正常了，你是否想给这个滚动过程加一个平滑滚动 (Smooth Scroll) 的效果，让点击菜单时的跳转不那么突兀？
`;

let news: string = `Donald Trump cancelled a planned trip by US officials to Pakistan for talks on the Iran war on Saturday, shortly after Tehran's delegation had left Islamabad.

The US president said special envoy Steve Witkoff and son-in-law Jared Kushner would be wasting "too much time", adding that if Iran wanted to talk "all they have to do is call".

Earlier, Iranian Foreign Minister Abbas Aragchi held talks with mediator Pakistan, saying afterwards he had shared Iran's position on ending the war but was yet to see whether the US was "truly serious about diplomacy".`;

</script>

<div class="row h-50">
  <div class="col-4 h-100 overflow-y-auto">
    <div id="list-example" class="list-group" data-sveltekit-reload>
      <a class="list-group-item list-group-item-action" href="#list-item-1">Item 1</a>
      <a class="list-group-item list-group-item-action" href="#list-item-2">Item 2</a>
      <a class="list-group-item list-group-item-action" href="#list-item-3">Item 3</a>
      <a class="list-group-item list-group-item-action" href="#list-item-4">Item 4</a>
    </div>
  </div>
  <div class="col-8 h-100 overflow-y-auto" style="position: relative;">
    <div data-bs-spy="scroll" data-bs-target="#list-example" data-bs-smooth-scroll="true" class="scrollspy-example h-100 overflow-y-auto" style="position: relative;">
      <h4 id="list-item-1">Item 1</h4>
      <p>{@html news}</p>
      <h4 id="list-item-2">Item 2</h4>
      <p>{@html news}</p>
      <h4 id="list-item-3">Item 3</h4>
      <p>{@html news}</p>
      <h4 id="list-item-4">Item 4</h4>
      <p>{@html news}</p>
    </div>
  </div>
</div>



<p>

{@html note}
</p>
