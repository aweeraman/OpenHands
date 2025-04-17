import asyncio
import sys
import time

from prompt_toolkit import print_formatted_text
from prompt_toolkit.formatted_text import FormattedText
from prompt_toolkit.shortcuts import print_container
from prompt_toolkit.widgets import Frame, TextArea
from prompt_toolkit.styles import Style
from prompt_toolkit.formatted_text import HTML

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

COLOR_GOLD = '#FFD700'
COLOR_GREY = '#808080'
DEFAULT_STYLE = Style.from_dict(
    {
        'gold': COLOR_GOLD,
        'grey': COLOR_GREY,
        'prompt': f'{COLOR_GOLD} bold',
    }
)

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


def display_banner(session_id: str, is_loaded: asyncio.Event):
    print_formatted_text(
        HTML(r"""<gold>
     ___                    _   _                 _
    /  _ \ _ __   ___ _ __ | | | | __ _ _ __   __| |___
    | | | | '_ \ / _ \ '_ \| |_| |/ _` | '_ \ / _` / __|
    | |_| | |_) |  __/ | | |  _  | (_| | | | | (_| \__ \
    \___ /| .__/ \___|_| |_|_| |_|\__,_|_| |_|\__,_|___/
          |_|
    </gold>"""),
        style=DEFAULT_STYLE,
    )

    print_formatted_text(HTML(f'<grey>OpenHands CLI v{__version__}</grey>'))

    banner_text = (
        'Initialized session' if is_loaded.is_set() else 'Initializing session'
    )
    print_formatted_text(HTML(f'\n<grey>{banner_text} {session_id}</grey>\n'))


def display_welcome_message():
    print_formatted_text(
        HTML("<gold>Let's start building!</gold>\n"), style=DEFAULT_STYLE
    )
    print_formatted_text(
        HTML('What do you want to build? <grey>Type /help for help</grey>\n'),
        style=DEFAULT_STYLE,
    )


def display_initialization_animation(text, is_loaded: asyncio.Event):
    ANIMATION_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏']

    i = 0
    while not is_loaded.is_set():
        sys.stdout.write('\n')
        sys.stdout.write(
            f'\033[s\033[J\033[38;2;255;215;0m[{ANIMATION_FRAMES[i % len(ANIMATION_FRAMES)]}] {text}\033[0m\033[u\033[1A'
        )
        sys.stdout.flush()
        time.sleep(0.1)
        i += 1

    sys.stdout.write('\r' + ' ' * (len(text) + 10) + '\r')
    sys.stdout.flush()


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
