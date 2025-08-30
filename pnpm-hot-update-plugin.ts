import { exec } from 'node:child_process';
import type { ErrorPayload, Plugin, ViteDevServer } from 'vite';

interface PnpmHotUpdateOptions {
  filePattern: string;
  command: string;
}

const name = 'pnpm-hot-update';

function pnpmHotUpdatePlugin(options: PnpmHotUpdateOptions): Plugin {
  return {
    name,
    async handleHotUpdate({ file, server }: { file: string; server: ViteDevServer }) {
      // Check if the changed file matches the configured pattern.
      if (file.endsWith(options.filePattern)) {
        console.log(`[pnpm-hot-update] File changed: ${file}`);
        console.log(`[pnpm-hot-update] Executing command: ${options.command}`);

        // Execute the pnpm command in a child process.
        exec(options.command, (error, stdout, stderr) => {
          if (error) {
            console.error(`[pnpm-hot-update] Command failed: ${error.message}`);
            // Use Vite's web socket to send an error message to the browser.
            server.ws.send({
              type: 'error',
              err: {
                message: `pnpm command failed: ${error.message}`,
                stack: error.stack,
                plugin: name,
              },
            } as ErrorPayload);
            return;
          }
          if (stdout) {
            console.log(stdout);
          }
          if (stderr) {
            console.error(stderr);
          }
          
          // After the command runs, send a full page reload event.
          console.log('[pnpm-hot-update] Command finished, sending full-reload.');
          server.ws.send({
            type: 'full-reload',
            path: '*',
          });
        });

        // Return an empty array to prevent other HMR updates.
        return [];
      }
    },
  };
}

export default pnpmHotUpdatePlugin;