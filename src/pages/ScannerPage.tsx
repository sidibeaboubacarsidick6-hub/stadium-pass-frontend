import { ScannerScreen } from '@/components/ScannerScreen'

export function ScannerPage() {
  return (
    <ScannerScreen
      matchTitle="ASEC Mimosas vs Africa Sports"
      gate="Porte C"
      zone="Virage Nord"
      isOnline={true}
      scannedCount={1234}
      validCount={1230}
      rejectedCount={4}
      currentResult={null}
    />
  )
}
