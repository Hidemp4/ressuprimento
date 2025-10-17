// ArmConfig.js - Configurações dos tipos de braços
export const ArmType = {
  HIGH_ROTATION: 'HIGH_ROTATION',
  LOW_ROTATION: 'LOW_ROTATION'
};

export const ArmConfig = {
  [ArmType.HIGH_ROTATION]: {
    stationCount: 8,
    stationSpacing: 20,
    hasBackRacks: true,
    backRackCount: 2,
    hasFrontRacks: true,
    frontRackCount: 3,
    rackType: 'FlowRack'
  },
  [ArmType.LOW_ROTATION]: {
    stationCount: 5,
    stationSpacing: 30, // Maior espaçamento entre estações
    hasBackRacks: true,
    backRackCount: 2,
    hasFrontRacks: true,
    frontRackCount: 3,
    rackType: 'LowRotationRack' // Será implementado depois
  }
};

export const RackLayout = {
  BACK: {
    spacing: 4,
    zPosition: -5,
    yPosition: 0.5,
    rotation: 0.05,
    levels: 5,
    boxesPerLevel: 7,
    maxBoxesPerRow: 6
  },
  FRONT: {
    spacing: 7,
    zPosition: 5,
    yPosition: 0.5,
    rotation: -0.05,
    levels: 2,
    boxesPerLevel: 7,
    maxBoxesPerRow: 5
  }
};