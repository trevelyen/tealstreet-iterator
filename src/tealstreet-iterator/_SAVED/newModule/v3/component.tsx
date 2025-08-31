const CustomModuleName = 'newModule'
// Choose a CustomModuleName for this script to automatically version
// Make sure to change the name to something else when starting a brand new custom module
// After confirming the desired name, save the script, then start iteration with pnpm run dev
// Each time you save this script, a new version of the custom module will be created in your saved modules


// Build here
const Component = () => {
  return <div className='p-4 border bg-gray-900'>Build Here</div>
}


// For development, will be removed in build
export default Component
