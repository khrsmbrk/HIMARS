import React from 'react';
import { Check } from 'lucide-react';

export enum ProkerStage {
  PENGAJUAN = "PENGAJUAN",
  DISETUJUI = "DISETUJUI",
  BERJALAN = "BERJALAN",
  SELESAI = "SELESAI"
}

interface ProkerStepperProps {
  currentStage: ProkerStage;
  onChangeStage?: (stage: ProkerStage) => void;
}

const STAGES = [
  ProkerStage.PENGAJUAN,
  ProkerStage.DISETUJUI,
  ProkerStage.BERJALAN,
  ProkerStage.SELESAI
];

export default function ProkerStepper({ currentStage, onChangeStage }: ProkerStepperProps) {
  const currentIndex = STAGES.indexOf(currentStage);

  const handleStageClick = (stage: ProkerStage, index: number) => {
    if (!onChangeStage) return;
    onChangeStage(stage);
  };

  return (
    <div className="flex items-center justify-between w-full relative">
      <div className="absolute left-0 right-0 top-3 sm:top-4 h-0.5 sm:h-1 bg-slate-100 -z-10" />
      <div 
        className="absolute left-0 top-3 sm:top-4 h-0.5 sm:h-1 bg-emerald-500 -z-10 transition-all duration-300" 
        style={{ width: `${(currentIndex / (STAGES.length - 1)) * 100}%` }} 
      />
      {STAGES.map((stage, index) => {
        const isCompleted = index < currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={stage} className="flex flex-col items-center relative z-10 bg-white px-2">
            <button
              onClick={() => handleStageClick(stage, index)}
              disabled={!onChangeStage}
              className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${
                isCompleted
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600 cursor-pointer'
                  : isActive
                  ? 'bg-himars-peach text-white ring-4 ring-himars-peach/20 cursor-pointer'
                  : onChangeStage
                  ? 'bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-600 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
            </button>
            <span className={`mt-1 sm:mt-2 text-[7px] sm:text-[9px] font-black uppercase tracking-wider text-center leading-tight w-16 sm:w-20 ${
              isActive ? 'text-himars-peach' : isCompleted ? 'text-emerald-500' : 'text-slate-400'
            }`}>
              {stage}
            </span>
          </div>
        );
      })}
    </div>
  );
}
