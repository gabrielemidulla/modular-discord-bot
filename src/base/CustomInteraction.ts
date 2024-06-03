
import { CustomClient } from "utils/CustomClient";
import { Interaction } from "discord.js";

export type CustomInteraction = Interaction & { client: CustomClient }