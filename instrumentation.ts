export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs' && process.env.VIBEPLOY_NODE_CPU_PROFILING === '1') {
    const { startCpuProfiling } = await import('./lib/server/cpu-profile')
    startCpuProfiling()
  }
}
