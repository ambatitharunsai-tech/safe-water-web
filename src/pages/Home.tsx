import { Hero } from '../components/sections/Hero';
import { About } from '../components/sections/About';
import { WaterSources } from '../components/sections/WaterSources';
import { Contamination } from '../components/sections/Contamination';
import { Health } from '../components/sections/Health';
import { Purification } from '../components/sections/Purification';
import { Storage } from '../components/sections/Storage';
import { Hygiene } from '../components/sections/Hygiene';
import { Environment } from '../components/sections/Environment';
import { ProjectActivities } from '../components/sections/ProjectActivities';
import { Objectives } from '../components/sections/Objectives';
import { Survey } from '../components/sections/Survey';
import { Awareness } from '../components/sections/Awareness';
import { Glossary } from '../components/sections/Glossary';
import { Tips } from '../components/sections/Tips';
import { Quiz } from '../components/sections/Quiz';
import { TakeAction } from '../components/sections/TakeAction';
import { AnimatedBackground } from '../components/ui/AnimatedBackground';

export function Home() {
  return (
    <>
      {/* Global animated floating droplets */}
      <AnimatedBackground />
      
      <Hero />
      <About />
      <Objectives />
      <WaterSources />
      <Contamination />
      <Health />
      <Purification />
      <Storage />
      <Hygiene />
      <Environment />
      <ProjectActivities />
      <Survey />
      <Awareness />
      
      {/* Interactive Features */}
      <Tips />
      <Quiz />
      <Glossary />
      
      <TakeAction />
    </>
  );
}
