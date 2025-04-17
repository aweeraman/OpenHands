from prompt_toolkit import print_formatted_text
from prompt_toolkit.formatted_text import FormattedText
from prompt_toolkit.shortcuts import print_container
from prompt_toolkit.widgets import Frame, TextArea

from openhands import __version__
from openhands.core.config import AppConfig
from openhands.events import EventSource
from openhands.events.action import (
    Action,
    ActionConfirmationStatus,
    CmdRunAction,
    FileEditAction,
    MessageAction,
)
from openhands.events.event import Event
from openhands.events.observation import (
    CmdOutputObservation,
    FileEditObservation,
    FileReadObservation,
)

COLOR_GREY = '#808080'

def display_event(event: Event, config: AppConfig) -> None:
    if isinstance(event, Action):
        if hasattr(event, 'thought'):
            display_message(event.thought)
    if isinstance(event, MessageAction):
        if event.source == EventSource.AGENT:
            display_message(event.content)
    if isinstance(event, CmdRunAction):
        display_command(event.command)
    if isinstance(event, CmdOutputObservation):
        display_command_output(event.content)
    if isinstance(event, FileEditAction):
        display_file_edit(event)
    if isinstance(event, FileEditObservation):
        display_file_edit(event)
    if isinstance(event, FileReadObservation):
        display_file_read(event)
    if hasattr(event, 'confirmation_state') and config.security.confirmation_mode:
        display_confirmation(event.confirmation_state)


def display_message(message: str):
    message = message.strip()

    if message:
        print_formatted_text(f'\n{message}\n')


def display_command(command: str):
    container = Frame(
        TextArea(
            text=command,
            read_only=True,
            style=COLOR_GREY,
            wrap_lines=True,
        ),
        title='Command Run',
        style=f'fg:{COLOR_GREY}',
    )
    print_container(container)
    print_formatted_text('')


def display_confirmation(confirmation_state: ActionConfirmationStatus):
    status_map = {
        ActionConfirmationStatus.CONFIRMED: ('ansigreen', '✅'),
        ActionConfirmationStatus.REJECTED: ('ansired', '❌'),
        ActionConfirmationStatus.AWAITING_CONFIRMATION: ('ansiyellow', '⏳'),
    }
    color, icon = status_map.get(confirmation_state, ('ansiyellow', ''))

    print_formatted_text(
        FormattedText(
            [
                (color, f'{icon} '),
                (color, str(confirmation_state)),
                ('', '\n'),
            ]
        )
    )


def display_command_output(output: str):
    lines = output.split('\n')
    formatted_lines = []
    for line in lines:
        if line.startswith('[Python Interpreter') or line.startswith('openhands@'):
            # TODO: clean this up once we clean up terminal output
            continue
        formatted_lines.append(line)
        formatted_lines.append('\n')

    # Remove the last newline if it exists
    if formatted_lines:
        formatted_lines.pop()

    container = Frame(
        TextArea(
            text=''.join(formatted_lines),
            read_only=True,
            style=COLOR_GREY,
            wrap_lines=True,
        ),
        title='Command Output',
        style=f'fg:{COLOR_GREY}',
    )
    print_container(container)
    print_formatted_text('')


def display_file_edit(event: FileEditAction | FileEditObservation):
    container = Frame(
        TextArea(
            text=f'{event}',
            read_only=True,
            style=COLOR_GREY,
            wrap_lines=True,
        ),
        title='File Edit',
        style=f'fg:{COLOR_GREY}',
    )
    print_container(container)
    print_formatted_text('')


def display_file_read(event: FileReadObservation):
    container = Frame(
        TextArea(
            text=f'{event}',
            read_only=True,
            style=COLOR_GREY,
            wrap_lines=True,
        ),
        title='File Read',
        style=f'fg:{COLOR_GREY}',
    )
    print_container(container)
    print_formatted_text('')
