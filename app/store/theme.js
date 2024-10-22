import { create } from 'zustand'

export const useStyle = create((set) => ({
    styles:{ 
        appSecClass : "flex flex-col lg:flex-row w-full h-full overflow-hidden md:overflow-auto  md:p-1 items-start justify-start",
        dashDivSection : " hidden sm:block w-3/12 min-h-full bg-gray-100",
        contDivSection : "h-auto flex flex-col text-black items-start w-full",
        sideBarNav : 'hidden lg:block lg:w-2/12 flex flex-col shadow-xl  pb-1 items-start justify-start overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100',
        bushuContSec : "w-full h-full bg-slate-50 shadow-xl grid py-1 place-items-center  overflow-y-scroll scrollbar-none md:scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100",
        bushuComponentContainer : "items-start justify-center w-11/12 h-auto p-2 m-2",
        componentWorkingDiv : " flex flex-col items-center space-y-1 items-stretch justify-start w-full   h-full lg:pt-5 lg:pb-5 lg:px-3",
        componentRowContainerMobile : "w-full bg-slate-50 shadow-xl rounded-xl p-2 flex space-y-1 flex-col items-stretch justify-center",
        componentRowContainerDesktop : "w-full bg-slate-50 shadow-xl rounded-xl p-2 flex space-y-1 flex-col items-stretch justify-center",
    },
    
  }))

