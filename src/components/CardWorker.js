// CardWorker.js
export function createCardWorkerUI() {
  const cardHTML = `
    <div class="fixed inset-0 flex justify-center items-end pb-2.5 pointer-events-none z-50 ">
      <div class="relative w-[150px] h-[242px] bg-[url('https://selimdoyranli.com/cdn/fut-player-card/img/card_bg.png')] bg-center bg-cover rounded-[0.75rem] pt-4 transform transition-transform duration-300 hover:scale-105 pointer-events-auto">

        <!-- Top -->
        <div class="relative flex mb-2 px-3 text-yellow-300">
          <div class="absolute top-6 left-3 uppercase font-light leading-[1.1rem]">
            <div class="text-xl font-bold">97</div>
            <div class="text-base font-bold">RW</div>
            <div class="w-4 h-3 mt-0.5">
              <img src="https://selimdoyranli.com/cdn/fut-player-card/img/argentina.svg" alt="Argentina" class="w-full h-full object-contain"/>
            </div>
            <div class="w-4.5 h-5 mt-0.5">
              <img src="https://selimdoyranli.com/cdn/fut-player-card/img/barcelona.svg" alt="Barcelona" class="w-full h-full object-contain"/>
            </div>
          </div>

          <!-- Player Image -->
          <div class="w-[100px] h-[100px] mx-auto overflow-hidden relative">
            <img src="https://selimdoyranli.com/cdn/fut-player-card/img/messi.png" alt="Messi" class="w-full h-full object-contain relative -right-3"/>
            <div class="absolute right-0 bottom-[-0.25rem] w-full h-4 flex justify-end text-white text-xs font-bold uppercase space-x-1">
              <span>4*SM</span>
              <span>4*WF</span>
            </div>
          </div>
        </div>

        <!-- Bottom -->
        <div class="relative mt-1">
          <div class="w-11/12 mx-auto text-yellow-300">
            <!-- Name -->
            <div class="text-center text-lg font-bold border-b border-yellow-300/10 pb-0.5">
              MESSI
            </div>

            <!-- Stats -->
            <div class="flex justify-center mt-1">
              <div class="pr-4.5 border-r border-yellow-300/10">
                <div class="flex text-xs uppercase">
                  <div class="mr-0.5 font-bold">97</div><div class="font-light">PAC</div>
                </div>
                <div class="flex text-xs uppercase">
                  <div class="mr-0.5 font-bold">95</div><div class="font-light">SHO</div>
                </div>
                <div class="flex text-xs uppercase">
                  <div class="mr-0.5 font-bold">94</div><div class="font-light">PAS</div>
                </div>
              </div>
              <div class="pl-4.5">
                <div class="flex text-xs uppercase">
                  <div class="mr-0.5 font-bold">99</div><div class="font-light">DRI</div>
                </div>
                <div class="flex text-xs uppercase">
                  <div class="mr-0.5 font-bold">35</div><div class="font-light">DEF</div>
                </div>
                <div class="flex text-xs uppercase">
                  <div class="mr-0.5 font-bold">68</div><div class="font-light">PHY</div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", cardHTML);
}
