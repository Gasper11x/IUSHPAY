// src/components/GuardResult.tsx
// Resultado de validación — lo que ve el vigilante en la tablet.
// Grande, legible de lejos, operable con una mano.

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { ValidateQRSuccess, ValidateQRFailure } from '../api/qrApi';
import { colors, spacing, radius, fontSize } from '../theme';

type Props = {
  result: ValidateQRSuccess | ValidateQRFailure;
  onReset: () => void;
};

const REASON_LABELS: Record<string, string> = {
  expired:          'QR expirado — pedir al estudiante que regenere',
  invalid:          'QR no válido',
  user_not_found:   'Usuario no encontrado en el sistema',
  wallet_not_found: 'Sin billetera asociada',
};

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ');
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0].slice(0, 2);
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials.toUpperCase()}</Text>
    </View>
  );
}

export default function GuardResult({ result, onReset }: Props) {

  // ─── Acceso denegado ───
  if (!result.valid) {
    return (
      <View style={styles.container}>
        <View style={[styles.card, styles.cardError]}>
          <Text style={styles.bigIcon}>✗</Text>
          <Text style={styles.titleError}>Acceso denegado</Text>
          <Text style={styles.reasonText}>
            {REASON_LABELS[result.reason] ?? result.reason}
          </Text>
        </View>
        <TouchableOpacity style={[styles.btn, styles.btnGray]} onPress={onReset}>
          <Text style={styles.btnText}>Escanear otro</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ─── Acceso permitido ───
  const balanceFormatted = result.balance.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  });

  return (
    <View style={styles.container}>
      <View style={[styles.card, styles.cardSuccess]}>
        {/* Usuario */}
        <View style={styles.userRow}>
          {result.avatarUrl
            ? <Image source={{ uri: result.avatarUrl }} style={styles.avatarImg} />
            : <Initials name={result.userName} />
          }
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{result.userName}</Text>
            <Text style={styles.userEmail}>{result.userEmail}</Text>
          </View>
        </View>

        {/* Saldo */}
        <View style={styles.balanceBox}>
          <Text style={styles.balanceLabel}>Saldo disponible</Text>
          <Text style={styles.balanceAmount}>{balanceFormatted}</Text>
        </View>
      </View>

      {/* Botones */}
      <View style={styles.btnRow}>
        <TouchableOpacity style={[styles.btn, styles.btnDeny, { flex: 1 }]} onPress={onReset}>
          <Text style={styles.btnText}>Denegar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnAllow, { flex: 2 }]} onPress={onReset}>
          <Text style={[styles.btnText, { fontSize: fontSize.lg }]}>✓ Permitir acceso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: spacing.lg,
  },
  card: {
    width: '100%',
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 3,
  },
  cardSuccess: {
    backgroundColor: colors.successBg,
    borderColor: colors.success,
  },
  cardError: {
    backgroundColor: colors.errorBg,
    borderColor: colors.error,
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  bigIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  titleError: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#991B1B',
    marginBottom: spacing.sm,
  },
  reasonText: {
    fontSize: fontSize.md,
    color: '#B91C1C',
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    backgroundColor: colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: fontSize.xl,
    fontWeight: '700',
  },
  avatarImg: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.xl,
    fontWeight: '700',
    color: '#14532D',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: fontSize.sm,
    color: '#166534',
  },
  balanceBox: {
    backgroundColor: 'rgba(0,0,0,0.06)',
    borderRadius: radius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: fontSize.sm,
    color: '#166534',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: fontSize.xxl,
    fontWeight: '700',
    color: '#14532D',
  },
  btnRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    width: '100%',
  },
  btn: {
    borderRadius: radius.md,
    paddingVertical: spacing.md + 4,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: fontSize.md,
    fontWeight: '700',
  },
  btnGray: {
    backgroundColor: colors.textMuted,
    width: '100%',
  },
  btnDeny: {
    backgroundColor: colors.error,
  },
  btnAllow: {
    backgroundColor: colors.success,
  },
});
